import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

function isAuthenticated(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD env var is not set.');
    return false;
  }
  const authHeader = req.headers.get('x-admin-password');
  return authHeader === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const summary = await db.getAnalyticsSummary();
    return Response.json(summary);
  } catch (err) {
    console.error('Admin analytics error:', err);
    return Response.json({ error: 'Failed to load analytics.' }, { status: 500 });
  }
}
