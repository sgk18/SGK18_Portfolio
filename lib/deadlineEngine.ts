import { prisma } from "./prisma";
import { Resend } from "resend";

// Priority calculation helper
export function getDeadlinePriority(deadline: Date): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  const diffMs = deadline.getTime() - Date.now();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours <= 0) return "CRITICAL";
  if (diffHours < 24) return "CRITICAL";
  if (diffHours < 24 * 3) return "HIGH";
  if (diffHours < 24 * 7) return "MEDIUM";
  return "LOW";
}

// Helper to calculate time remaining text
export function getTimeRemainingText(deadline: Date): string {
  const diffMs = deadline.getTime() - Date.now();
  if (diffMs <= 0) return "Passed";
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) {
    const mins = Math.max(Math.round(diffMs / (1000 * 60)), 0);
    return `${mins} Mins`;
  }
  if (diffHours < 24) {
    return `${Math.round(diffHours)} Hours`;
  }
  const days = Math.round(diffHours / 24);
  return `${days} Days`;
}

export const DeadlineEngine = {
  // ─── NOTIFICATION TRACKING HELPERS ─────────────────────────────────────────
  async shouldNotify(entityType: string, entityId: string, notificationType: string): Promise<boolean> {
    const log = await prisma.notificationLog.findUnique({
      where: {
        entityType_entityId_notificationType: {
          entityType,
          entityId,
          notificationType,
        },
      },
    });
    return !log;
  },

  async logNotification(entityType: string, entityId: string, notificationType: string, recipient: string, status: "SENT" | "FAILED") {
    await prisma.notificationLog.upsert({
      where: {
        entityType_entityId_notificationType: {
          entityType,
          entityId,
          notificationType,
        },
      },
      update: {
        sentAt: new Date(),
        status,
      },
      create: {
        entityType,
        entityId,
        notificationType,
        recipient,
        status,
      },
    });
  },

  // ─── DASHBOARD ALERTS GENERATION ───────────────────────────────────────────
  async createDashboardAlert(title: string, message: string, urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW", relatedType: string, relatedId: string) {
    // Check if duplicate alert already exists
    const existing = await prisma.dashboardAlert.findFirst({
      where: {
        relatedType,
        relatedId,
        title,
        dismissed: false,
      },
    });

    if (!existing) {
      await prisma.dashboardAlert.create({
        data: {
          title,
          message,
          urgency,
          relatedType,
          relatedId,
        },
      });
    }
  },

  // ─── MAIN DEADLINE & WINDOW AUDITING ───────────────────────────────────────
  async runAudit(password: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "CareerOS <onboarding@resend.dev>";
    const toEmail = process.env.RESEND_INBOUND_EMAIL || "suryachalam18@gmail.com";

    const resend = apiKey ? new Resend(apiKey) : null;
    const now = new Date();

    // ─── 1. HACKATHONS (Deadlines & Window checks) ───
    const hackathons = await prisma.hackathon.findMany({
      where: {
        status: { notIn: ["COMPLETED", "FINALIST", "WON", "EXPIRED"] },
        deadline: { gte: now },
      },
    });

    for (const hack of hackathons) {
      if (!hack.deadline) continue;
      const deadline = new Date(hack.deadline);
      const diffMs = deadline.getTime() - now.getTime();
      const priority = getDeadlinePriority(deadline);
      const timeRemaining = getTimeRemainingText(deadline);

      // Windows rules: 30d, 14d, 7d, 5d, 4d, 3d, 2d, 1d, 12h, 6h, 1h
      const rules = [
        { label: "DEADLINE_30_DAYS", offsetMs: 30 * 24 * 60 * 60 * 1000 },
        { label: "DEADLINE_14_DAYS", offsetMs: 14 * 24 * 60 * 60 * 1000 },
        { label: "DEADLINE_7_DAYS", offsetMs: 7 * 24 * 60 * 60 * 1000 },
        { label: "DEADLINE_5_DAYS", offsetMs: 5 * 24 * 60 * 60 * 1000 },
        { label: "DEADLINE_4_DAYS", offsetMs: 4 * 24 * 60 * 60 * 1000 },
        { label: "DEADLINE_3_DAYS", offsetMs: 3 * 24 * 60 * 60 * 1000 },
        { label: "DEADLINE_2_DAYS", offsetMs: 2 * 24 * 60 * 60 * 1000 },
        { label: "DEADLINE_1_DAY", offsetMs: 1 * 24 * 60 * 60 * 1000 },
        { label: "DEADLINE_12_HOURS", offsetMs: 12 * 60 * 60 * 1000 },
        { label: "DEADLINE_6_HOURS", offsetMs: 6 * 60 * 60 * 1000 },
        { label: "DEADLINE_1_HOUR", offsetMs: 1 * 60 * 60 * 1000 },
      ];

      for (const r of rules) {
        const triggerTime = deadline.getTime() - r.offsetMs;
        // Sliding execution check: triggers within a 24 hour window
        if (now.getTime() >= triggerTime && now.getTime() <= triggerTime + 24 * 60 * 60 * 1000) {
          const isPending = await this.shouldNotify("HACKATHON", hack.id, r.label);
          if (isPending) {
            let emailStatus: "SENT" | "FAILED" = "FAILED";
            if (resend) {
              try {
                await resend.emails.send({
                  from: fromEmail,
                  to: toEmail,
                  subject: `[CareerOS Warning] ${hack.name} Deadline in ${timeRemaining}!`,
                  html: this.getEmailLayoutHtml(hack.name, `Deadline approaches in ${timeRemaining} (${deadline.toLocaleDateString()}). Prize pool: ${hack.prize || "General"}.`, priority, timeRemaining, `/admin?tab=hackathons`),
                });
                emailStatus = "SENT";
              } catch (e) {
                console.error(e);
              }
            }

            await this.logNotification("HACKATHON", hack.id, r.label, toEmail, emailStatus);
            await this.createDashboardAlert(`Hackathon Approaching: ${hack.name}`, `Deadline closes in ${timeRemaining}.`, priority, "HACKATHON", hack.id);
            await prisma.activityLog.create({
              data: {
                action: "Hackathon Reminder Sent",
                metadata: JSON.stringify({ hackathonId: hack.id, label: r.label }),
              },
            });
          }
        }
      }
    }

    // ─── 2. OPPORTUNITIES (Jobs & Internships) ───
    const opportunities = await prisma.opportunity.findMany({
      where: {
        status: { notIn: ["CLOSED", "REJECTED", "OFFER", "EXPIRED"] },
        deadline: { gte: now },
      },
    });

    for (const opp of opportunities) {
      if (!opp.deadline) continue;
      const deadline = new Date(opp.deadline);
      const diffMs = deadline.getTime() - now.getTime();
      const priority = getDeadlinePriority(deadline);
      const timeRemaining = getTimeRemainingText(deadline);

      const isIntern = opp.type === "INTERNSHIP";
      // Intern: 21d, 14d, 7d, 5d, 3d, 2d, 1d
      // Job: 14d, 7d, 3d, 2d, 1d
      const rules = isIntern
        ? [
            { label: "DEADLINE_21_DAYS", offsetMs: 21 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_14_DAYS", offsetMs: 14 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_7_DAYS", offsetMs: 7 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_5_DAYS", offsetMs: 5 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_3_DAYS", offsetMs: 3 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_2_DAYS", offsetMs: 2 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_1_DAY", offsetMs: 1 * 24 * 60 * 60 * 1000 },
          ]
        : [
            { label: "DEADLINE_14_DAYS", offsetMs: 14 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_7_DAYS", offsetMs: 7 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_3_DAYS", offsetMs: 3 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_2_DAYS", offsetMs: 2 * 24 * 60 * 60 * 1000 },
            { label: "DEADLINE_1_DAY", offsetMs: 1 * 24 * 60 * 60 * 1000 },
          ];

      for (const r of rules) {
        const triggerTime = deadline.getTime() - r.offsetMs;
        if (now.getTime() >= triggerTime && now.getTime() <= triggerTime + 24 * 60 * 60 * 1000) {
          const isPending = await this.shouldNotify("OPPORTUNITY", opp.id, r.label);
          if (isPending) {
            let emailStatus: "SENT" | "FAILED" = "FAILED";
            if (resend) {
              try {
                await resend.emails.send({
                  from: fromEmail,
                  to: toEmail,
                  subject: `[CareerOS Warning] Opportunity ${opp.title} @ ${opp.company} Closes in ${timeRemaining}!`,
                  html: this.getEmailLayoutHtml(`${opp.title} (${opp.company})`, `Application deadline closes in ${timeRemaining}. Source: ${opp.source || "General"}.`, priority, timeRemaining, `/admin?tab=opportunities`),
                });
                emailStatus = "SENT";
              } catch (e) {
                console.error(e);
              }
            }

            await this.logNotification("OPPORTUNITY", opp.id, r.label, toEmail, emailStatus);
            await this.createDashboardAlert(`Opportunity Closing: ${opp.title} @ ${opp.company}`, `Deadline in ${timeRemaining}.`, priority, "OPPORTUNITY", opp.id);
          }
        }
      }
    }

    // ─── 3. APPLICATIONS (Follow-up deadlines) ───
    const applications = await prisma.application.findMany({
      where: {
        status: { notIn: ["REJECTED", "OFFER", "EXPIRED"] },
        nextFollowUp: { gte: now },
      },
    });

    for (const app of applications) {
      if (!app.nextFollowUp) continue;
      const followUp = new Date(app.nextFollowUp);
      const diffMs = followUp.getTime() - now.getTime();
      const priority = getDeadlinePriority(followUp);
      const timeRemaining = getTimeRemainingText(followUp);

      // Job Applications rules: 14d, 7d, 3d, 2d, 1d
      const rules = [
        { label: "FOLLOWUP_14_DAYS", offsetMs: 14 * 24 * 60 * 60 * 1000 },
        { label: "FOLLOWUP_7_DAYS", offsetMs: 7 * 24 * 60 * 60 * 1000 },
        { label: "FOLLOWUP_3_DAYS", offsetMs: 3 * 24 * 60 * 60 * 1000 },
        { label: "FOLLOWUP_2_DAYS", offsetMs: 2 * 24 * 60 * 60 * 1000 },
        { label: "FOLLOWUP_1_DAY", offsetMs: 1 * 24 * 60 * 60 * 1000 },
      ];

      for (const r of rules) {
        const triggerTime = followUp.getTime() - r.offsetMs;
        if (now.getTime() >= triggerTime && now.getTime() <= triggerTime + 24 * 60 * 60 * 1000) {
          const isPending = await this.shouldNotify("APPLICATION", app.id, r.label);
          if (isPending) {
            let emailStatus: "SENT" | "FAILED" = "FAILED";
            if (resend) {
              try {
                await resend.emails.send({
                  from: fromEmail,
                  to: toEmail,
                  subject: `[CareerOS Warning] Application Follow Up for ${app.role} @ ${app.company} in ${timeRemaining}!`,
                  html: this.getEmailLayoutHtml(`${app.role} @ ${app.company}`, `Follow-up interval is in ${timeRemaining}. Current application status: ${app.status}.`, priority, timeRemaining, `/admin?tab=applications`),
                });
                emailStatus = "SENT";
              } catch (e) {
                console.error(e);
              }
            }

            await this.logNotification("APPLICATION", app.id, r.label, toEmail, emailStatus);
            await this.createDashboardAlert(`Application Follow-up: ${app.role} @ ${app.company}`, `Follow-up in ${timeRemaining}.`, priority, "APPLICATION", app.id);
          }
        }
      }
    }

    // ─── 4. EVENTS (Conferences, Webinars, registrations) ───
    const events = await prisma.event.findMany({
      where: {
        startDate: { gte: now },
      },
    });

    for (const evt of events) {
      const start = new Date(evt.startDate);
      const diffMs = start.getTime() - now.getTime();
      const priority = getDeadlinePriority(start);
      const timeRemaining = getTimeRemainingText(start);

      // Event rules: 7d, 3d, 1d, morning of (defined as same day, triggering morning of)
      const rules = [
        { label: "EVENT_7_DAYS", offsetMs: 7 * 24 * 60 * 60 * 1000 },
        { label: "EVENT_3_DAYS", offsetMs: 3 * 24 * 60 * 60 * 1000 },
        { label: "EVENT_1_DAY", offsetMs: 1 * 24 * 60 * 60 * 1000 },
        { label: "EVENT_MORNING", offsetMs: 0 }, // Handled day of event morning check
      ];

      for (const r of rules) {
        let triggerTime = start.getTime() - r.offsetMs;
        if (r.label === "EVENT_MORNING") {
          // Trigger morning of event day at 8:00 AM local time
          const morningDate = new Date(start);
          morningDate.setHours(8, 0, 0, 0);
          triggerTime = morningDate.getTime();
        }

        if (now.getTime() >= triggerTime && now.getTime() <= triggerTime + 24 * 60 * 60 * 1000) {
          const isPending = await this.shouldNotify("EVENT", evt.id, r.label);
          if (isPending) {
            let emailStatus: "SENT" | "FAILED" = "FAILED";
            if (resend) {
              try {
                await resend.emails.send({
                  from: fromEmail,
                  to: toEmail,
                  subject: `[CareerOS Event] ${evt.title} Starts in ${timeRemaining}!`,
                  html: this.getEmailLayoutHtml(evt.title, `Starts in ${timeRemaining} (${start.toLocaleString()}). Category: ${evt.category}. Location: ${evt.location || "Online"}.`, priority, timeRemaining, `/admin?tab=events`),
                });
                emailStatus = "SENT";
              } catch (e) {
                console.error(e);
              }
            }

            await this.logNotification("EVENT", evt.id, r.label, toEmail, emailStatus);
            await this.createDashboardAlert(`Upcoming Event: ${evt.title}`, `Starts in ${timeRemaining}.`, priority, "EVENT", evt.id);
          }
        }
      }
    }

    // ─── 5. RECRUITER FOLLOW-UPS (Contacts list) ───
    const contacts = await prisma.contact.findMany({
      where: {
        nextFollowUp: { gte: now },
      },
    });

    for (const c of contacts) {
      if (!c.nextFollowUp) continue;
      const followUp = new Date(c.nextFollowUp);
      const diffMs = followUp.getTime() - now.getTime();
      const priority = getDeadlinePriority(followUp);
      const timeRemaining = getTimeRemainingText(followUp);

      // Contact follow-up: 3d, 1d, day of
      const rules = [
        { label: "RECRUITER_3_DAYS", offsetMs: 3 * 24 * 60 * 60 * 1000 },
        { label: "RECRUITER_1_DAY", offsetMs: 1 * 24 * 60 * 60 * 1000 },
        { label: "RECRUITER_DAY_OF", offsetMs: 0 },
      ];

      for (const r of rules) {
        let triggerTime = followUp.getTime() - r.offsetMs;
        if (r.label === "RECRUITER_DAY_OF") {
          const morningDate = new Date(followUp);
          morningDate.setHours(8, 0, 0, 0);
          triggerTime = morningDate.getTime();
        }

        if (now.getTime() >= triggerTime && now.getTime() <= triggerTime + 24 * 60 * 60 * 1000) {
          const isPending = await this.shouldNotify("CONTACT", c.id, r.label);
          if (isPending) {
            let emailStatus: "SENT" | "FAILED" = "FAILED";
            if (resend) {
              try {
                await resend.emails.send({
                  from: fromEmail,
                  to: toEmail,
                  subject: `[CareerOS Recruiter alert] Follow up with ${c.name} in ${timeRemaining}!`,
                  html: this.getEmailLayoutHtml(`Follow up: ${c.name}`, `Schedule is set for ${timeRemaining} (${followUp.toLocaleDateString()}). Company: ${c.company || "General"}. Role: ${c.role || "N/A"}.`, priority, timeRemaining, `/admin?tab=networking`),
                });
                emailStatus = "SENT";
              } catch (e) {
                console.error(e);
              }
            }

            await this.logNotification("CONTACT", c.id, r.label, toEmail, emailStatus);
            await this.createDashboardAlert(`Follow up: ${c.name}`, `Follow up scheduled in ${timeRemaining}.`, priority, "CONTACT", c.id);
          }
        }
      }
    }

    // ─── 6. GOALS (Deadlines warnings) ───
    const goals = await prisma.goal.findMany({
      where: {
        status: { notIn: ["COMPLETED", "ARCHIVED"] },
        targetDate: { gte: now },
      },
    });

    for (const g of goals) {
      if (!g.targetDate) continue;
      const target = new Date(g.targetDate);
      const diffMs = target.getTime() - now.getTime();
      const priority = getDeadlinePriority(target);
      const timeRemaining = getTimeRemainingText(target);

      // Goal rules: 7d, 3d, 1d, day of
      const rules = [
        { label: "GOAL_7_DAYS", offsetMs: 7 * 24 * 60 * 60 * 1000 },
        { label: "GOAL_3_DAYS", offsetMs: 3 * 24 * 60 * 60 * 1000 },
        { label: "GOAL_1_DAY", offsetMs: 1 * 24 * 60 * 60 * 1000 },
        { label: "GOAL_DAY_OF", offsetMs: 0 },
      ];

      for (const r of rules) {
        let triggerTime = target.getTime() - r.offsetMs;
        if (r.label === "GOAL_DAY_OF") {
          const morningDate = new Date(target);
          morningDate.setHours(8, 0, 0, 0);
          triggerTime = morningDate.getTime();
        }

        if (now.getTime() >= triggerTime && now.getTime() <= triggerTime + 24 * 60 * 60 * 1000) {
          const isPending = await this.shouldNotify("GOAL", g.id, r.label);
          if (isPending) {
            let emailStatus: "SENT" | "FAILED" = "FAILED";
            if (resend) {
              try {
                await resend.emails.send({
                  from: fromEmail,
                  to: toEmail,
                  subject: `[CareerOS Goal] "${g.title}" target closes in ${timeRemaining}!`,
                  html: this.getEmailLayoutHtml(g.title, `Goal achievement date is in ${timeRemaining} (${target.toLocaleDateString()}). Current progress is ${g.progress}%.`, priority, timeRemaining, `/admin?tab=goals`),
                });
                emailStatus = "SENT";
              } catch (e) {
                console.error(e);
              }
            }

            await this.logNotification("GOAL", g.id, r.label, toEmail, emailStatus);
            await this.createDashboardAlert(`Goal Target Approaching: ${g.title}`, `Target deadline in ${timeRemaining}. Current progress: ${g.progress}%.`, priority, "GOAL", g.id);
          }
        }
      }
    }
  },

  // ─── TRANSITIONING EXPIRED ITEMS AUTOMATICALLY ─────────────────────────────
  async processExpiredItems() {
    const now = new Date();

    // 1. Opportunities Expiration
    const expiredOpps = await prisma.opportunity.findMany({
      where: {
        deadline: { lt: now },
        status: { notIn: ["CLOSED", "REJECTED", "OFFER", "EXPIRED"] },
      },
    });
    for (const opp of expiredOpps) {
      await prisma.opportunity.update({
        where: { id: opp.id },
        data: { status: "EXPIRED" },
      });
      await prisma.activityLog.create({
        data: {
          action: "Opportunity Expired",
          metadata: JSON.stringify({ id: opp.id, title: opp.title, company: opp.company }),
        },
      });
      await this.createDashboardAlert(`Opportunity Expired: ${opp.title} @ ${opp.company}`, `Deadline has passed. Archive or update?`, "CRITICAL", "OPPORTUNITY", opp.id);
    }

    // 2. Hackathons Expiration
    const expiredHacks = await prisma.hackathon.findMany({
      where: {
        deadline: { lt: now },
        status: { notIn: ["COMPLETED", "FINALIST", "WON", "EXPIRED"] },
      },
    });
    for (const hack of expiredHacks) {
      await prisma.hackathon.update({
        where: { id: hack.id },
        data: { status: "EXPIRED" },
      });
      await prisma.activityLog.create({
        data: {
          action: "Hackathon Expired",
          metadata: JSON.stringify({ id: hack.id, name: hack.name }),
        },
      });
      await this.createDashboardAlert(`Hackathon Expired: ${hack.name}`, `Registration deadline passed.`, "CRITICAL", "HACKATHON", hack.id);
    }

    // 3. Applications Expiration
    const expiredApps = await prisma.application.findMany({
      where: {
        nextFollowUp: { lt: now },
        status: { notIn: ["REJECTED", "OFFER", "EXPIRED"] },
      },
    });
    for (const app of expiredApps) {
      await prisma.application.update({
        where: { id: app.id },
        data: { status: "EXPIRED" },
      });
      await prisma.activityLog.create({
        data: {
          action: "Application Follow Up Missed",
          metadata: JSON.stringify({ id: app.id, role: app.role, company: app.company }),
        },
      });
      await this.createDashboardAlert(`Application Follow-up Missed: ${app.role} @ ${app.company}`, `Scheduled follow-up date passed.`, "CRITICAL", "APPLICATION", app.id);
    }

    // 4. Goals Expiration
    const expiredGoals = await prisma.goal.findMany({
      where: {
        targetDate: { lt: now },
        status: { notIn: ["COMPLETED", "ARCHIVED", "EXPIRED"] },
      },
    });
    for (const g of expiredGoals) {
      await prisma.goal.update({
        where: { id: g.id },
        data: { status: "ARCHIVED" },
      });
      await prisma.activityLog.create({
        data: {
          action: "Goal Target Date Passed",
          metadata: JSON.stringify({ id: g.id, title: g.title }),
        },
      });
      await this.createDashboardAlert(`Goal Deadline Passed: ${g.title}`, `Target date passed. Status has been archived.`, "CRITICAL", "GOAL", g.id);
    }
  },

  // ─── DAILY BRIEF DIGEST GATHERER (8:00 AM) ─────────────────────────────────
  async sendDailyBrief(toEmail: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Brief <onboarding@resend.dev>";
    if (!apiKey) return;

    const resend = new Resend(apiKey);
    const now = new Date();
    const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Fetch Priorities
    const [opps, hacks, apps, events] = await Promise.all([
      prisma.opportunity.findMany({ where: { deadline: { lte: endOfWeek, gte: now }, status: { notIn: ["CLOSED", "REJECTED", "OFFER", "EXPIRED"] } } }),
      prisma.hackathon.findMany({ where: { deadline: { lte: endOfWeek, gte: now }, status: { notIn: ["COMPLETED", "FINALIST", "WON", "EXPIRED"] } } }),
      prisma.application.findMany({ where: { nextFollowUp: { lte: endOfWeek, gte: now }, status: { notIn: ["REJECTED", "OFFER", "EXPIRED"] } } }),
      prisma.event.findMany({ where: { startDate: { lte: endOfWeek, gte: now } } }),
    ]);

    const localDateStr = new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Format HTML blocks
    const priorityItemsHtml = [
      ...opps.map(o => `<li><strong>${o.title} @ ${o.company}</strong> closes in ${getTimeRemainingText(new Date(o.deadline!))}</li>`),
      ...hacks.map(h => `<li><strong>${h.name}</strong> registration closes in ${getTimeRemainingText(new Date(h.deadline!))}</li>`),
      ...apps.map(a => `<li><strong>Follow up for ${a.role} @ ${a.company}</strong> is due in ${getTimeRemainingText(new Date(a.nextFollowUp!))}</li>`),
    ].join("");

    const weekItemsHtml = [
      ...events.map(e => `<li><strong>${e.title}</strong> (${e.category}) starts on ${new Date(e.startDate).toLocaleDateString()}</li>`),
    ].join("");

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: auto;">
        <h2 style="color: #6366f1; margin-top: 0; font-size: 20px;">CareerOS Daily Brief — ${localDateStr}</h2>
        <p style="font-size: 14px; color: #475569;">Here is your proactive career digest for this morning.</p>
        
        <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-size: 15px; margin-top: 24px;">Today's Core Priorities</h3>
        <ul style="font-size: 13px; color: #334155; line-height: 1.6; padding-left: 20px;">
          ${priorityItemsHtml || "<li>No high-priority deadlines closing today. Keep pushing!</li>"}
        </ul>

        <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-size: 15px; margin-top: 24px;">Upcoming This Week</h3>
        <ul style="font-size: 13px; color: #334155; line-height: 1.6; padding-left: 20px;">
          ${weekItemsHtml || "<li>No workshops or events scheduled for this week.</li>"}
        </ul>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <a href="http://localhost:3000/admin" style="display: inline-block; background-color: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none;">Open CareerOS Dashboard</a>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `CareerOS Daily Brief — ${localDateStr}`,
      html: htmlContent,
    });
  },

  // ─── EVENING STATUS DIGEST GATHERER (8:00 PM) ──────────────────────────────
  async sendEveningSummary(toEmail: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Summary <onboarding@resend.dev>";
    if (!apiKey) return;

    const resend = new Resend(apiKey);
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    // Completed logs today
    const logs = await prisma.activityLog.findMany({
      where: {
        createdAt: { gte: startOfDay },
      },
    });

    const localDateStr = new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const completedItemsHtml = logs.map(l => `<li>${l.action}</li>`).join("");

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: auto;">
        <h2 style="color: #6366f1; margin-top: 0; font-size: 20px;">CareerOS Evening Summary — ${localDateStr}</h2>
        <p style="font-size: 14px; color: #475569;">Reflecting on today's progress.</p>
        
        <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-size: 15px; margin-top: 24px;">What Was Completed Today</h3>
        <ul style="font-size: 13px; color: #334155; line-height: 1.6; padding-left: 20px;">
          ${completedItemsHtml || "<li>No activities logged today. Take step by step tomorrow!</li>"}
        </ul>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <a href="http://localhost:3000/admin" style="display: inline-block; background-color: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none;">Review CareerOS Console</a>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `CareerOS Evening Summary — ${localDateStr}`,
      html: htmlContent,
    });
  },

  // ─── EMAIL TEMPLATES CREATION PATTERNS ─────────────────────────────────────
  getEmailLayoutHtml(title: string, description: string, priority: string, timeRemaining: string, actionPath: string) {
    const priorityColor = priority === "CRITICAL" ? "#ef4444" : priority === "HIGH" ? "#f97316" : priority === "MEDIUM" ? "#eab308" : "#94a3b8";
    return `
      <div style="font-family: sans-serif; max-width: 600px; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #6366f1; margin: 0; font-size: 18px;">CareerOS Warning Alert</h2>
          <span style="background-color: ${priorityColor}20; color: ${priorityColor}; border: 1px solid ${priorityColor}40; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase;">
            ${priority} Priority
          </span>
        </div>
        <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 16px;">${title}</h3>
        <p style="font-size: 14px; line-height: 1.5; color: #475569; margin: 0 0 16px 0;">${description}</p>
        <div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px;">
          <p style="font-size: 12px; color: #475569; margin: 0;">Time Remaining: <strong>${timeRemaining}</strong></p>
        </div>
        <a href="http://localhost:3000${actionPath}" style="display: inline-block; background-color: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none;">Open in CareerOS</a>
      </div>
    `;
  },
};
