import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page, referrer } = body;

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const userAgent = req.headers.get('user-agent') || '';

    await db.trackVisit(page || '/', referrer || 'direct', userAgent, ipHash);

    return Response.json({ success: true });
  } catch (err) {
    console.error('Visit tracking error:', err);
    return Response.json({ error: 'Failed to track visit.' }, { status: 500 });
  }
}
