import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const results: Record<string, { success: boolean; count?: number; error?: string }> = {};

  const queries = {
    opportunity: () => prisma.opportunity.count(),
    hackathon: () => prisma.hackathon.count(),
    application: () => prisma.application.count(),
    event: () => prisma.event.count(),
    learningRoadmap: () => prisma.learningRoadmap.count(),
    goal: () => prisma.goal.count(),
    contact: () => prisma.contact.count(),
    note: () => prisma.note.count(),
    reminder: () => prisma.reminder.count(),
    activityLog: () => prisma.activityLog.count(),
    dashboardAlert: () => prisma.dashboardAlert.count(),
    visit: () => prisma.visit.count(),
    contactWithConversations: () => prisma.contact.findMany({
      take: 1,
      include: {
        conversations: {
          include: { messages: { take: 1 } }
        }
      }
    })
  };

  let allSuccess = true;

  for (const [key, fn] of Object.entries(queries)) {
    try {
      const res = await fn();
      results[key] = {
        success: true,
        count: typeof res === 'number' ? res : Array.isArray(res) ? res.length : 1
      };
    } catch (err: any) {
      allSuccess = false;
      results[key] = {
        success: false,
        error: err.message || String(err)
      };
    }
  }

  return NextResponse.json({
    success: allSuccess,
    results,
    envState: {
      hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
      hasTursoAuthToken: !!process.env.TURSO_AUTH_TOKEN,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDatabaseAuthToken: !!process.env.DATABASE_AUTH_TOKEN,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
