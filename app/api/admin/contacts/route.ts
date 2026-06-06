import { db } from '@/lib/db';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

function isAuthenticated(req: NextRequest): boolean | Response {
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
    const contacts = await prisma.contact.findMany({
      include: {
        conversations: {
          orderBy: { lastMessageAt: 'desc' },
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = contacts.map(c => {
      const firstConv = c.conversations[0];
      const firstMsg = firstConv?.messages[0];
      let mappedStatus: 'pending' | 'reviewed' | 'ignored' = 'reviewed';
      if (c.status === 'NEW') mappedStatus = 'pending';
      else if (c.status === 'CLOSED') mappedStatus = 'ignored';

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        subject: firstConv?.subject || 'No Subject',
        message: firstMsg?.content || 'No message content',
        status: mappedStatus,
        createdAt: c.createdAt.toISOString(),
      };
    });

    return Response.json(mapped);
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

    let crmStatus = 'CONTACTED';
    if (status === 'pending') crmStatus = 'NEW';
    else if (status === 'ignored') crmStatus = 'CLOSED';

    const success = await db.updateContactStatus(id, crmStatus);
    return Response.json({ success });
  } catch (err) {
    console.error('Admin contacts PATCH error:', err);
    return Response.json({ error: 'Failed to update contact.' }, { status: 500 });
  }
}
