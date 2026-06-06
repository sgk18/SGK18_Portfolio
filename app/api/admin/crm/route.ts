import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

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
    const url = new URL(req.url);
    const contactId = url.searchParams.get('contactId');
    const analytics = url.searchParams.get('analytics') === 'true';
    const activity = url.searchParams.get('activity') === 'true';
    const search = url.searchParams.get('search') || undefined;
    const filter = url.searchParams.get('filter') || undefined;
    const sort = (url.searchParams.get('sort') || 'recent') as 'recent' | 'oldest' | 'name';

    if (contactId) {
      const details = await db.getConversationDetails(contactId);
      if (!details) {
        return Response.json({ error: 'Contact not found.' }, { status: 404 });
      }
      return Response.json(details);
    }

    if (analytics) {
      const summary = await db.getCRMAnalytics();
      return Response.json(summary);
    }

    if (activity) {
      const logs = await db.getActivityLogs();
      return Response.json(logs);
    }

    const contacts = await db.getCRMContacts(search, filter, sort);
    return Response.json(contacts);
  } catch (err) {
    console.error('CRM GET error:', err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return Response.json({ error: 'Contact ID and status are required.' }, { status: 400 });
    }

    const success = await db.updateContactStatus(id, status);
    if (!success) {
      return Response.json({ error: 'Failed to update status.' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('CRM PATCH error:', err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id, notes } = await req.json();
    if (!id || notes === undefined) {
      return Response.json({ error: 'Contact ID and notes content are required.' }, { status: 400 });
    }

    const success = await db.saveContactNotes(id, notes);
    if (!success) {
      return Response.json({ error: 'Failed to save notes.' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('CRM PUT error:', err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
