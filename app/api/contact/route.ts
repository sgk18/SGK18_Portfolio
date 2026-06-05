import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

// In-memory rate limiter (resets on server restart, sufficient for most use cases)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute window
  const maxRequests = 3;

  const entry = rateLimitMap.get(ipHash);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ipHash, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= maxRequests) {
    return true;
  }
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, hp_field } = body;

    // Honeypot: bots fill hidden fields; humans don't
    if (hp_field) {
      return Response.json({ success: true }); // Silently accept to confuse bots
    }

    // IP-based rate limiting
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    if (isRateLimited(ipHash)) {
      return Response.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    // Validation
    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return Response.json({ error: 'Input exceeds maximum allowed length.' }, { status: 400 });
    }

    // Save to database
    await db.saveContactSubmission(name, email, subject, message);

    // Track analytics
    await db.trackVisit('/contact-submit', '', '', ipHash);

    // Send emails if Resend is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);

      // Notify Surya
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['suryachalam18@gmail.com'],
        subject: `[Portfolio] New message from ${name}: ${subject}`,
        replyTo: email,
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2 style="color: #6366f1;">New Contact Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 1px solid #e2e8f0;" />
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });

      // Confirm to sender
      await resend.emails.send({
        from: 'Surya <onboarding@resend.dev>',
        to: [email],
        subject: `Got your message, ${name}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2 style="color: #6366f1;">Thanks for reaching out!</h2>
            <p>Hi ${name},</p>
            <p>I received your message and will get back to you as soon as possible.</p>
            <blockquote style="border-left: 3px solid #6366f1; padding-left: 1rem; color: #64748b;">
              ${message}
            </blockquote>
            <p>Best,<br/>Surya</p>
          </div>
        `,
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
