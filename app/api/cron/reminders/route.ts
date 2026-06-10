import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  // Check authorization header if you want to restrict cron trigger
  // e.g., a simple Bearer token or CRON_SECRET matching.
  // For now, we allow trigger but can check CRON_SECRET if present in env.
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

  try {
    const now = new Date();
    // Query active pending reminders
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

    if (pendingReminders.length === 0) {
      return NextResponse.json({ message: "No pending email reminders to process" });
    }

    const resend = new Resend(apiKey);
    const results = [];

    for (const reminder of pendingReminders) {
      try {
        const emailResponse = await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `[CareerOS] ${reminder.title}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="color: #6366f1; margin-top: 0;">CareerOS Reminder Notification</h2>
              <h3 style="margin-bottom: 5px;">${reminder.title}</h3>
              <p style="font-size: 14px; line-height: 1.5; color: #475569;">${reminder.message || "No additional message details."}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 11px; color: #94a3b8;">
                This is an automated notification from your Personal Career Operating System.<br />
                Scheduled time: ${new Date(reminder.reminderDate).toLocaleString()}<br />
                Target Entity: ${reminder.targetType || "None"} (${reminder.targetId || "N/A"})
              </p>
            </div>
          `,
        });

        if (emailResponse.error) {
          console.error(`Failed to send email for reminder ${reminder.id}:`, emailResponse.error);
          results.push({ id: reminder.id, success: false, error: emailResponse.error });
        } else {
          // Mark reminder completed since email was dispatched
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { completed: true }
          });
          results.push({ id: reminder.id, success: true });

          // Also log to ActivityLog
          await prisma.activityLog.create({
            data: {
              action: "Reminder Sent",
              metadata: JSON.stringify({
                reminderId: reminder.id,
                title: reminder.title,
                sentTo: toEmail,
              })
            }
          });
        }
      } catch (err: any) {
        console.error(`Error sending email for reminder ${reminder.id}:`, err);
        results.push({ id: reminder.id, success: false, error: err.message });
      }
    }

    return NextResponse.json({
      message: `Processed ${pendingReminders.length} email reminders`,
      results
    });
  } catch (err: any) {
    console.error("Reminder cron error:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
