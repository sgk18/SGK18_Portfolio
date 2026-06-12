"use server";

import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

// Helper to authenticate actions
function checkAuth(pw: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || pw !== adminPassword) {
    throw new Error("Unauthorized access key");
  }
}

// Helper to log timeline activities
async function logActivity(action: string, metadataObj: any) {
  await prisma.activityLog.create({
    data: {
      action,
      metadata: JSON.stringify(metadataObj),
    },
  });
}

// ─── REMINDER ENGINE DYNAMIC SYNC HELPERS ────────────────────────────────────

async function syncHackathonReminders(hackathonId: string) {
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
  });

  if (!hackathon || !hackathon.deadline) return;

  // Delete existing uncompleted reminders for this hackathon
  await prisma.reminder.deleteMany({
    where: {
      targetType: "HACKATHON",
      targetId: hackathonId,
      completed: false,
    },
  });

  const deadline = new Date(hackathon.deadline);
  const now = new Date();

  // Reminder rules: 7 days, 3 days, 1 day, 6 hours
  const intervals = [
    { label: "7 days remaining", offsetMs: 7 * 24 * 60 * 60 * 1000 },
    { label: "3 days remaining", offsetMs: 3 * 24 * 60 * 60 * 1000 },
    { label: "1 day remaining", offsetMs: 1 * 24 * 60 * 60 * 1000 },
    { label: "6 hours remaining", offsetMs: 6 * 60 * 60 * 1000 },
  ];

  for (const interval of intervals) {
    const reminderDate = new Date(deadline.getTime() - interval.offsetMs);
    if (reminderDate > now) {
      await prisma.reminder.create({
        data: {
          title: `Hackathon Reminder: ${hackathon.name}`,
          message: `Deadline is in ${interval.label} (${deadline.toLocaleDateString()})`,
          reminderDate,
          type: "BOTH",
          targetType: "HACKATHON",
          targetId: hackathonId,
        },
      });
    }
  }
}

async function syncApplicationReminders(applicationId: string) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!app || !app.nextFollowUp) return;

  // Delete existing uncompleted reminders for this application
  await prisma.reminder.deleteMany({
    where: {
      targetType: "APPLICATION",
      targetId: applicationId,
      completed: false,
    },
  });

  const followUp = new Date(app.nextFollowUp);
  const now = new Date();

  // Reminder rules: 3 days, 1 day before
  const intervals = [
    { label: "3 days before follow-up", offsetMs: 3 * 24 * 60 * 60 * 1000 },
    { label: "1 day before follow-up", offsetMs: 1 * 24 * 60 * 60 * 1000 },
  ];

  for (const interval of intervals) {
    const reminderDate = new Date(followUp.getTime() - interval.offsetMs);
    if (reminderDate > now) {
      await prisma.reminder.create({
        data: {
          title: `Application Follow-up: ${app.role} @ ${app.company}`,
          message: `Scheduled follow-up is in ${interval.label}`,
          reminderDate,
          type: "BOTH",
          targetType: "APPLICATION",
          targetId: applicationId,
        },
      });
    }
  }
}

async function syncContactReminders(contactId: string) {
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  });

  if (!contact || !contact.nextFollowUp) return;

  // Delete existing uncompleted reminders for this contact
  await prisma.reminder.deleteMany({
    where: {
      targetType: "CONTACT",
      targetId: contactId,
      completed: false,
    },
  });

  const followUp = new Date(contact.nextFollowUp);
  const now = new Date();

  if (followUp > now) {
    await prisma.reminder.create({
      data: {
        title: `Recruiter CRM Follow-up: ${contact.name} (${contact.company || "Unknown Company"})`,
        message: `Scheduled follow-up today with recruiter ${contact.name}.`,
        reminderDate: followUp,
        type: "BOTH",
        targetType: "CONTACT",
        targetId: contactId,
      },
    });
  }
}

async function syncGoalReminders(goalId: string) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  });

  if (!goal || !goal.targetDate) return;

  await prisma.reminder.deleteMany({
    where: {
      targetType: "GOAL",
      targetId: goalId,
      completed: false,
    },
  });

  const target = new Date(goal.targetDate);
  const now = new Date();

  if (target > now) {
    await prisma.reminder.create({
      data: {
        title: `Goal Deadline: ${goal.title}`,
        message: `Goal "${goal.title}" target date is today. Status: ${goal.status}`,
        reminderDate: target,
        type: "DASHBOARD",
        targetType: "GOAL",
        targetId: goalId,
      },
    });
  }
}


// ─── AUTHENTICATION ACTION ───────────────────────────────────────────────────

export async function verifyPasswordAction(pw: string) {
  try {
    checkAuth(pw);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


export async function getDashboardData(pw: string) {
  checkAuth(pw);

  const [
    opportunities,
    hackathons,
    applications,
    events,
    roadmaps,
    goals,
    contacts,
    notes,
    reminders,
    activityLogs,
    dashboardAlerts,
    totalPageViews,
    uniqueIpHashes
  ] = await Promise.all([
    prisma.opportunity.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.hackathon.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.application.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.event.findMany({ orderBy: { startDate: "asc" } }),
    prisma.learningRoadmap.findMany({ orderBy: { topic: "asc" } }),
    prisma.goal.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.contact.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        conversations: {
          orderBy: { lastMessageAt: "desc" },
          include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } }
        }
      }
    }),
    prisma.note.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.reminder.findMany({ orderBy: { reminderDate: "asc" } }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.dashboardAlert.findMany({ where: { dismissed: false }, orderBy: { createdAt: "desc" } }),
    prisma.visit.count(),
    prisma.visit.findMany({ select: { ipHash: true } }),
  ]);

  const totalVisitors = new Set(uniqueIpHashes.map(v => v.ipHash)).size;

  return {
    opportunities,
    hackathons,
    applications,
    events,
    roadmaps,
    goals,
    totalPageViews,
    totalVisitors,
    contacts: contacts.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      lastContact: c.lastContact?.toISOString() || null,
      nextFollowUp: c.nextFollowUp?.toISOString() || null,
      conversations: c.conversations.map(conv => ({
        ...conv,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
        lastMessageAt: conv.lastMessageAt.toISOString(),
        messages: conv.messages.map(m => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))
      }))
    })),
    notes: notes.map(n => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    })),
    reminders: reminders.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      reminderDate: r.reminderDate.toISOString(),
    })),
    activityLogs: activityLogs.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
    dashboardAlerts: dashboardAlerts.map(da => ({
      ...da,
      createdAt: da.createdAt.toISOString(),
    })),
  };
}


// ─── OPPORTUNITY ACTIONS ─────────────────────────────────────────────────────

const OpportunitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  type: z.enum(["INTERNSHIP", "JOB", "FREELANCE", "OPEN_SOURCE", "STARTUP", "COLLABORATION"]),
  status: z.enum(["DISCOVERED", "RESEARCHING", "APPLIED", "IN_PROGRESS", "INTERVIEW", "OFFER", "REJECTED", "CLOSED"]),
  source: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  notes: z.string().optional(),
  deadline: z.string().nullable().optional(),
});

export async function createOpportunity(pw: string, data: any) {
  checkAuth(pw);
  const validated = OpportunitySchema.parse(data);

  const opp = await prisma.opportunity.create({
    data: {
      ...validated,
      deadline: validated.deadline ? new Date(validated.deadline) : null,
    },
  });

  await logActivity("Opportunity Created", {
    id: opp.id,
    title: opp.title,
    company: opp.company,
    type: opp.type,
  });

  return opp;
}

export async function updateOpportunity(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = OpportunitySchema.parse(data);

  const opp = await prisma.opportunity.update({
    where: { id },
    data: {
      ...validated,
      deadline: validated.deadline ? new Date(validated.deadline) : null,
    },
  });

  await logActivity("Opportunity Updated", {
    id,
    title: opp.title,
    company: opp.company,
    status: opp.status,
  });

  return opp;
}

export async function deleteOpportunity(pw: string, id: string) {
  checkAuth(pw);
  const opp = await prisma.opportunity.delete({ where: { id } });
  await logActivity("Opportunity Deleted", { id, title: opp.title, company: opp.company });
  return opp;
}


// ─── HACKATHON ACTIONS ───────────────────────────────────────────────────────

const HackathonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  organizer: z.string().min(1, "Organizer is required"),
  website: z.string().optional(),
  deadline: z.string().nullable().optional(),
  eventDate: z.string().nullable().optional(),
  status: z.enum(["RESEARCHING", "PLANNING", "REGISTERED", "SUBMITTED", "COMPLETED", "FINALIST", "WON"]),
  prize: z.string().optional(),
  teamMembers: z.string().optional(),
  notes: z.string().optional(),
});

export async function createHackathon(pw: string, data: any) {
  checkAuth(pw);
  const validated = HackathonSchema.parse(data);

  const hack = await prisma.hackathon.create({
    data: {
      ...validated,
      deadline: validated.deadline ? new Date(validated.deadline) : null,
      eventDate: validated.eventDate ? new Date(validated.eventDate) : null,
    },
  });

  await syncHackathonReminders(hack.id);

  await logActivity("Registered for Hackathon", {
    id: hack.id,
    name: hack.name,
    status: hack.status,
  });

  return hack;
}

export async function updateHackathon(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = HackathonSchema.parse(data);

  const hack = await prisma.hackathon.update({
    where: { id },
    data: {
      ...validated,
      deadline: validated.deadline ? new Date(validated.deadline) : null,
      eventDate: validated.eventDate ? new Date(validated.eventDate) : null,
    },
  });

  await syncHackathonReminders(id);

  await logActivity("Hackathon Updated", {
    id,
    name: hack.name,
    status: hack.status,
  });

  return hack;
}

export async function deleteHackathon(pw: string, id: string) {
  checkAuth(pw);
  const hack = await prisma.hackathon.delete({ where: { id } });

  await prisma.reminder.deleteMany({
    where: { targetType: "HACKATHON", targetId: id },
  });

  await logActivity("Hackathon Deleted", { id, name: hack.name });
  return hack;
}


// ─── APPLICATION ACTIONS ─────────────────────────────────────────────────────

const ApplicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  appliedDate: z.string().nullable().optional(),
  nextFollowUp: z.string().nullable().optional(),
  status: z.enum(["SAVED", "APPLIED", "OA", "INTERVIEW", "FINAL_ROUND", "OFFER", "REJECTED"]),
  notes: z.string().optional(),
});

export async function createApplication(pw: string, data: any) {
  checkAuth(pw);
  const validated = ApplicationSchema.parse(data);

  const app = await prisma.application.create({
    data: {
      ...validated,
      appliedDate: validated.appliedDate ? new Date(validated.appliedDate) : null,
      nextFollowUp: validated.nextFollowUp ? new Date(validated.nextFollowUp) : null,
    },
  });

  await syncApplicationReminders(app.id);

  await logActivity("Applied for Role", {
    id: app.id,
    company: app.company,
    role: app.role,
    status: app.status,
  });

  return app;
}

export async function updateApplication(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = ApplicationSchema.parse(data);

  const app = await prisma.application.update({
    where: { id },
    data: {
      ...validated,
      appliedDate: validated.appliedDate ? new Date(validated.appliedDate) : null,
      nextFollowUp: validated.nextFollowUp ? new Date(validated.nextFollowUp) : null,
    },
  });

  await syncApplicationReminders(id);

  await logActivity("Application Updated", {
    id,
    company: app.company,
    role: app.role,
    status: app.status,
  });

  return app;
}

export async function deleteApplication(pw: string, id: string) {
  checkAuth(pw);
  const app = await prisma.application.delete({ where: { id } });

  await prisma.reminder.deleteMany({
    where: { targetType: "APPLICATION", targetId: id },
  });

  await logActivity("Application Deleted", { id, company: app.company, role: app.role });
  return app;
}


// ─── EVENT ACTIONS ───────────────────────────────────────────────────────────

const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().nullable().optional(),
  registrationLink: z.string().optional(),
  notes: z.string().optional(),
});

export async function createEvent(pw: string, data: any) {
  checkAuth(pw);
  const validated = EventSchema.parse(data);

  const evt = await prisma.event.create({
    data: {
      ...validated,
      startDate: new Date(validated.startDate),
      endDate: validated.endDate ? new Date(validated.endDate) : null,
    },
  });

  await logActivity("Event Added", {
    id: evt.id,
    title: evt.title,
    category: evt.category,
  });

  return evt;
}

export async function updateEvent(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = EventSchema.parse(data);

  const evt = await prisma.event.update({
    where: { id },
    data: {
      ...validated,
      startDate: new Date(validated.startDate),
      endDate: validated.endDate ? new Date(validated.endDate) : null,
    },
  });

  await logActivity("Event Updated", {
    id,
    title: evt.title,
    category: evt.category,
  });

  return evt;
}

export async function deleteEvent(pw: string, id: string) {
  checkAuth(pw);
  const evt = await prisma.event.delete({ where: { id } });
  await logActivity("Event Deleted", { id, title: evt.title });
  return evt;
}


// ─── LEARNING ROADMAP ACTIONS ────────────────────────────────────────────────

const RoadmapSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  category: z.string().optional(),
  progress: z.number().min(0).max(100),
  targetDate: z.string().nullable().optional(),
  resources: z.string().optional(),
  notes: z.string().optional(),
});

export async function createLearningRoadmap(pw: string, data: any) {
  checkAuth(pw);
  const validated = RoadmapSchema.parse(data);

  const map = await prisma.learningRoadmap.create({
    data: {
      ...validated,
      targetDate: validated.targetDate ? new Date(validated.targetDate) : null,
    },
  });

  await logActivity("Started Learning roadmap", {
    id: map.id,
    topic: map.topic,
    progress: map.progress,
  });

  return map;
}

export async function updateLearningRoadmap(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = RoadmapSchema.parse(data);

  const map = await prisma.learningRoadmap.update({
    where: { id },
    data: {
      ...validated,
      targetDate: validated.targetDate ? new Date(validated.targetDate) : null,
    },
  });

  await logActivity("Roadmap Progress Updated", {
    id,
    topic: map.topic,
    progress: map.progress,
  });

  return map;
}

export async function deleteLearningRoadmap(pw: string, id: string) {
  checkAuth(pw);
  const map = await prisma.learningRoadmap.delete({ where: { id } });
  await logActivity("Roadmap Deleted", { id, topic: map.topic });
  return map;
}


// ─── GOAL ACTIONS ────────────────────────────────────────────────────────────

const GoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["ANNUAL", "QUARTERLY", "MONTHLY", "WEEKLY"]),
  status: z.enum(["NOT_STARTED", "ACTIVE", "COMPLETED", "ARCHIVED"]),
  progress: z.number().min(0).max(100),
  targetDate: z.string().nullable().optional(),
});

export async function createGoal(pw: string, data: any) {
  checkAuth(pw);
  const validated = GoalSchema.parse(data);

  const goal = await prisma.goal.create({
    data: {
      ...validated,
      targetDate: validated.targetDate ? new Date(validated.targetDate) : null,
    },
  });

  await syncGoalReminders(goal.id);

  await logActivity("Goal Defined", {
    id: goal.id,
    title: goal.title,
    category: goal.category,
    status: goal.status,
  });

  return goal;
}

export async function updateGoal(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = GoalSchema.parse(data);

  const goal = await prisma.goal.update({
    where: { id },
    data: {
      ...validated,
      targetDate: validated.targetDate ? new Date(validated.targetDate) : null,
    },
  });

  await syncGoalReminders(id);

  await logActivity("Goal Updated", {
    id,
    title: goal.title,
    status: goal.status,
    progress: goal.progress,
  });

  return goal;
}

export async function deleteGoal(pw: string, id: string) {
  checkAuth(pw);
  const goal = await prisma.goal.delete({ where: { id } });

  await prisma.reminder.deleteMany({
    where: { targetType: "GOAL", targetId: id },
  });

  await logActivity("Goal Deleted", { id, title: goal.title });
  return goal;
}


// ─── NETWORKING CRM CONTACT ACTIONS ──────────────────────────────────────────

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().optional(),
  role: z.string().optional(),
  linkedin: z.string().optional(),
  status: z.string().default("NEW"),
  source: z.string().default("CRM"),
  notes: z.string().optional(),
  lastContact: z.string().nullable().optional(),
  nextFollowUp: z.string().nullable().optional(),
});

export async function createContact(pw: string, data: any) {
  checkAuth(pw);
  const validated = ContactSchema.parse(data);

  const contact = await prisma.contact.create({
    data: {
      ...validated,
      lastContact: validated.lastContact ? new Date(validated.lastContact) : null,
      nextFollowUp: validated.nextFollowUp ? new Date(validated.nextFollowUp) : null,
    },
  });

  await syncContactReminders(contact.id);

  await logActivity("Contact Created", {
    contactId: contact.id,
    contactName: contact.name,
    company: contact.company,
  });

  return contact;
}

export async function updateContact(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = ContactSchema.parse(data);

  const contact = await prisma.contact.update({
    where: { id },
    data: {
      ...validated,
      lastContact: validated.lastContact ? new Date(validated.lastContact) : null,
      nextFollowUp: validated.nextFollowUp ? new Date(validated.nextFollowUp) : null,
    },
  });

  await syncContactReminders(id);

  await logActivity("Contact Updated", {
    contactId: id,
    contactName: contact.name,
    status: contact.status,
  });

  return contact;
}

export async function deleteContact(pw: string, id: string) {
  checkAuth(pw);
  const contact = await prisma.contact.delete({ where: { id } });

  await prisma.reminder.deleteMany({
    where: { targetType: "CONTACT", targetId: id },
  });

  await logActivity("Contact Deleted", { contactId: id, name: contact.name });
  return contact;
}


// ─── NOTES ACTIONS ───────────────────────────────────────────────────────────

const NoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

export async function createNote(pw: string, data: any) {
  checkAuth(pw);
  const validated = NoteSchema.parse(data);

  const note = await prisma.note.create({
    data: validated,
  });

  await logActivity("Note Added", {
    id: note.id,
    title: note.title,
  });

  return note;
}

export async function updateNote(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = NoteSchema.parse(data);

  const note = await prisma.note.update({
    where: { id },
    data: validated,
  });

  await logActivity("Note Updated", {
    id,
    title: note.title,
  });

  return note;
}

export async function deleteNote(pw: string, id: string) {
  checkAuth(pw);
  const note = await prisma.note.delete({ where: { id } });
  await logActivity("Note Deleted", { id, title: note.title });
  return note;
}


// ─── REMINDER ENGINE ACTIONS ─────────────────────────────────────────────────

const ReminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().optional(),
  reminderDate: z.string().min(1, "Reminder date is required"),
  type: z.enum(["EMAIL", "DASHBOARD", "BOTH"]),
  completed: z.boolean().default(false),
});

export async function createReminder(pw: string, data: any) {
  checkAuth(pw);
  const validated = ReminderSchema.parse(data);

  const reminder = await prisma.reminder.create({
    data: {
      ...validated,
      reminderDate: new Date(validated.reminderDate),
    },
  });

  await logActivity("Reminder Scheduled", {
    id: reminder.id,
    title: reminder.title,
    date: reminder.reminderDate,
  });

  return reminder;
}

export async function updateReminder(pw: string, id: string, data: any) {
  checkAuth(pw);
  const validated = ReminderSchema.parse(data);

  const reminder = await prisma.reminder.update({
    where: { id },
    data: {
      ...validated,
      reminderDate: new Date(validated.reminderDate),
    },
  });

  await logActivity("Reminder Updated", {
    id,
    title: reminder.title,
    completed: reminder.completed,
  });

  return reminder;
}

export async function toggleReminderCompleted(pw: string, id: string, completed: boolean) {
  checkAuth(pw);
  const reminder = await prisma.reminder.update({
    where: { id },
    data: { completed },
  });

  await logActivity("Reminder Status Checked", {
    id,
    title: reminder.title,
    completed,
  });

  return reminder;
}

export async function deleteReminder(pw: string, id: string) {
  checkAuth(pw);
  const reminder = await prisma.reminder.delete({ where: { id } });
  await logActivity("Reminder Deleted", { id, title: reminder.title });
  return reminder;
}


// ─── GLOBAL SEARCH ACTION ────────────────────────────────────────────────────

export async function globalSearchAction(pw: string, query: string) {
  checkAuth(pw);
  const q = query.trim().toLowerCase();
  if (!q) return { contacts: [], opportunities: [], hackathons: [], notes: [], events: [], applications: [] };

  const [
    contacts,
    opportunities,
    hackathons,
    notes,
    events,
    applications
  ] = await Promise.all([
    prisma.contact.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { company: { contains: q } },
          { role: { contains: q } },
          { notes: { contains: q } },
        ]
      },
      take: 5
    }),
    prisma.opportunity.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { company: { contains: q } },
          { notes: { contains: q } },
          { source: { contains: q } },
        ]
      },
      take: 5
    }),
    prisma.hackathon.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { organizer: { contains: q } },
          { notes: { contains: q } },
          { prize: { contains: q } },
        ]
      },
      take: 5
    }),
    prisma.note.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { tags: { contains: q } },
        ]
      },
      take: 10
    }),
    prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { category: { contains: q } },
          { location: { contains: q } },
          { notes: { contains: q } },
        ]
      },
      take: 5
    }),
    prisma.application.findMany({
      where: {
        OR: [
          { company: { contains: q } },
          { role: { contains: q } },
          { location: { contains: q } },
          { notes: { contains: q } },
        ]
      },
      take: 5
    }),
  ]);

  return {
    contacts: contacts.map(c => ({ ...c, type: "contact" })),
    opportunities: opportunities.map(o => ({ ...o, type: "opportunity" })),
    hackathons: hackathons.map(h => ({ ...h, type: "hackathon" })),
    notes: notes.map(n => ({ ...n, type: "note" })),
    events: events.map(e => ({ ...e, type: "event" })),
    applications: applications.map(a => ({ ...a, type: "application" })),
  };
}

export async function getDashboardAlertsAction(pw: string) {
  checkAuth(pw);
  const alerts = await prisma.dashboardAlert.findMany({
    where: { dismissed: false },
    orderBy: { createdAt: "desc" },
  });
  return alerts.map(da => ({
    ...da,
    createdAt: da.createdAt.toISOString(),
  }));
}

export async function markAlertReadAction(pw: string, id: string) {
  checkAuth(pw);
  const alert = await prisma.dashboardAlert.update({
    where: { id },
    data: { read: true },
  });
  return {
    ...alert,
    createdAt: alert.createdAt.toISOString(),
  };
}

export async function dismissAlertAction(pw: string, id: string) {
  checkAuth(pw);
  const alert = await prisma.dashboardAlert.update({
    where: { id },
    data: { dismissed: true },
  });
  return {
    ...alert,
    createdAt: alert.createdAt.toISOString(),
  };
}

// Action to manually trigger a proactive audit run
export async function runAuditAction(pw: string) {
  checkAuth(pw);
  const { DeadlineEngine } = await import("@/lib/engine/deadlineEngine");
  await DeadlineEngine.runAudit(pw);
  await DeadlineEngine.processExpiredItems();
  return { success: true };
}
