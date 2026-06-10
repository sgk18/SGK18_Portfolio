import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { DeadlineEngine } from "@/lib/deadlineEngine";

export async function GET(req: NextRequest) {
  // Authorization secret
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 500 });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "CareerOS <onboarding@resend.dev>";
  const toEmail = process.env.RESEND_INBOUND_EMAIL || "suryachalam18@gmail.com";

  const url = new URL(req.url);
  const forceBrief = url.searchParams.get("forceBrief") === "true";
  const forceEvening = url.searchParams.get("forceEvening") === "true";

  const adminPassword = process.env.ADMIN_PASSWORD || "admin12";

  try {
    const now = new Date();

    // ─── 1. RUN PROACTIVE DEADLINE ENGINE AUDIT ───
    await DeadlineEngine.runAudit(adminPassword);

    // ─── 2. PROCESS EXPIRED ITEMS ───
    await DeadlineEngine.processExpiredItems();

    // ─── 3. PROCESS DIGEST TRIGGERS (8:00 AM and 8:00 PM IST checks) ───
    // Calculate local IST (UTC+5:30) date & hour
    const localTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const localHour = localTime.getUTCHours();
    const localDateStr = localTime.toISOString().substring(0, 10); // "YYYY-MM-DD"

    const cronReport: any = {
      auditRun: true,
      expiredProcessed: true,
      briefSent: false,
      eveningSent: false,
      userRemindersProcessed: 0,
    };

    // A. Daily Brief: Triggered between 8:00 AM and 8:59 AM IST, or if forced
    if ((localHour === 8 && !forceEvening) || forceBrief) {
      const typeLabel = `DAILY_BRIEF_${localDateStr}`;
      const isPending = await DeadlineEngine.shouldNotify("DIGEST", "DAILY_BRIEF", typeLabel);
      if (isPending) {
        await DeadlineEngine.sendDailyBrief(toEmail);
        await DeadlineEngine.logNotification("DIGEST", "DAILY_BRIEF", typeLabel, toEmail, "SENT");
        cronReport.briefSent = true;
        await prisma.activityLog.create({
          data: {
            action: "Daily Brief Sent",
            metadata: JSON.stringify({ date: localDateStr }),
          },
        });
      }
    }

    // B. Evening Summary: Triggered between 8:00 PM (20) and 8:59 PM IST, or if forced
    if ((localHour === 20 && !forceBrief) || forceEvening) {
      const typeLabel = `EVENING_SUMMARY_${localDateStr}`;
      const isPending = await DeadlineEngine.shouldNotify("DIGEST", "EVENING_SUMMARY", typeLabel);
      if (isPending) {
        await DeadlineEngine.sendEveningSummary(toEmail);
        await DeadlineEngine.logNotification("DIGEST", "EVENING_SUMMARY", typeLabel, toEmail, "SENT");
        cronReport.eveningSent = true;
        await prisma.activityLog.create({
          data: {
            action: "Evening Summary Sent",
            metadata: JSON.stringify({ date: localDateStr }),
          },
        });
      }
    }

    // ─── 4. PROCESS TRADITIONAL DUE REMINDERS (User Scheduled) ───
    const pendingReminders = await prisma.reminder.findMany({
      where: {
        reminderDate: { lte: now },
        completed: false,
        OR: [
          { type: "EMAIL" },
          { type: "BOTH" }
        ]
      }
    });

    if (pendingReminders.length > 0) {
      const resend = new Resend(apiKey);
      for (const reminder of pendingReminders) {
        try {
          await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: `[CareerOS] ${reminder.title}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; max-width: 600px; margin: auto;">
                <h2 style="color: #6366f1; margin-top: 0; font-size: 18px;">CareerOS Reminder</h2>
                <h3 style="margin-bottom: 5px; font-size: 15px;">${reminder.title}</h3>
                <p style="font-size: 14px; line-height: 1.5; color: #475569;">${reminder.message || "No details provided."}</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 10px; color: #94a3b8;">
                  Scheduled time: ${new Date(reminder.reminderDate).toLocaleString()} IST<br />
                  Target Item: ${reminder.targetType || "General"} (${reminder.targetId || "N/A"})
                </p>
              </div>
            `,
          });

          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { completed: true }
          });
          cronReport.userRemindersProcessed++;
        } catch (err) {
          console.error(`Error sending email for reminder ${reminder.id}:`, err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Proactive audit executed successfully",
      cronReport
    });
  } catch (err: any) {
    console.error("Proactive reminder cron error:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
