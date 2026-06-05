import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

function isAuthenticated(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const authHeader = req.headers.get('x-admin-password');
  return authHeader === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  try {
    const contacts = await db.getContactSubmissions();
    return Response.json(contacts);
  } catch (err) {
    console.error('Admin contacts error:', err);
    return Response.json({ error: 'Failed to load contacts.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  try {
    const { id, status } = await req.json();
    if (!id || !['pending', 'reviewed', 'ignored'].includes(status)) {
      return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }
    const success = await db.updateContactStatus(id, status);
    return Response.json({ success });
  } catch (err) {
    console.error('Admin contacts PATCH error:', err);
    return Response.json({ error: 'Failed to update contact.' }, { status: 500 });
  }
}
