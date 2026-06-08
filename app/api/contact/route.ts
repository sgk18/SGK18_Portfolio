import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { prisma } from '@/lib/prisma';

// In-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute
  const maxRequests = 5;

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
    const { name, email, subject, message, company, role, linkedin, hp_field } = body;

    // Honeypot: bots fill hidden fields; humans don't
    if (hp_field) {
      return Response.json({ success: true });
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

    // Save to relational database (fail gracefully if DB is not configured)
    let contact: any = null;
    let conversation: any = null;
    let dbMessage: any = null;

    try {
      const saved = await db.saveContactSubmission(
        name,
        email,
        subject,
        message,
        company,
        role,
        linkedin
      );
      contact = saved.contact;
      conversation = saved.conversation;
      dbMessage = saved.message;

      // Track analytics (best-effort)
      try {
        await db.trackVisit('/contact-submit', '', '', ipHash);
      } catch (visErr) {
        console.error('Track visit failed:', visErr);
      }
    } catch (dbErr) {
      console.error('DB save failed, continuing without DB:', dbErr);
      // Provide fallback placeholders so later code can still run
      const tsId = `tmp-${Date.now()}`;
      contact = { id: tsId, name, email };
      conversation = { id: `${tsId}-conv`, subject };
      dbMessage = { id: `${tsId}-msg` };
    }

    // Send emails if Resend is configured
    const apiKey = process.env.RESEND_API_KEY;
    const fromDomain = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
    const replyToEmail = process.env.RESEND_INBOUND_EMAIL || 'suryachalam18@gmail.com';

    if (apiKey) {
      const resend = new Resend(apiKey);

      // 1. Confirm to sender (this will set the message-id they reply to)
      const confirmEmail = await resend.emails.send({
        from: fromDomain,
        to: [email],
        replyTo: replyToEmail,
        subject: `Re: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6;">
            <h2 style="color: #6366f1; font-weight: 700; margin-bottom: 24px;">Thanks for reaching out!</h2>
            <p>Hi ${name},</p>
            <p>I have received your message and will get back to you as soon as possible.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0; font-weight: 600; font-size: 14px; color: #475569;">Your message:</p>
              <p style="margin: 8px 0 0 0; color: #64748b; font-style: italic; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="margin-top: 24px;">Best regards,<br/><strong>Suryachalam V M</strong></p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">
              This conversation is managed via Surya's Recruiter CRM. You can reply directly to this email to thread future messages.
            </p>
          </div>
        `,
      });

      // Save the email message ID of this confirmation email (best-effort)
      // We will match inbound replies' In-Reply-To header with this ID!
      if (confirmEmail.data?.id) {
        try {
          if (dbMessage?.id && typeof prisma?.message?.update === 'function') {
            await prisma.message.update({
              where: { id: dbMessage.id },
              data: { emailMessageId: confirmEmail.data.id },
            });
          }
        } catch (prErr) {
          console.error('Failed to save emailMessageId to DB:', prErr);
        }
      }

      // 2. Notify Surya
      await resend.emails.send({
        from: fromDomain,
        to: ['suryachalam18@gmail.com'],
        replyTo: email,
        subject: `[CRM] New Thread: ${name} (${company || 'No Company'}) - ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #1e293b;">
            <h2 style="color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New CRM Lead</h2>
            <p><strong>Recruiter Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Role:</strong> ${role || 'N/A'}</p>
            <p><strong>LinkedIn:</strong> ${linkedin || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px; white-space: pre-wrap;">${message}</div>
            <p style="margin-top: 25px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/admin/crm?id=${contact.id}" 
                 style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Open in CRM Dashboard
              </a>
            </p>
          </div>
        `,
      });
    }

    return Response.json({ success: true, contactId: contact.id });
  } catch (err) {
    console.error('Contact API error:', err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
