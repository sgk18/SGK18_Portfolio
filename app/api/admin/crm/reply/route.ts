import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { prisma } from '@/lib/prisma';

function isAuthenticated(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD env var is not set.');
    return false;
  }
  const authHeader = req.headers.get('x-admin-password');
  return authHeader === adminPassword;
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { conversationId, content } = await req.json();
    if (!conversationId || !content) {
      return Response.json({ error: 'Conversation ID and message content are required.' }, { status: 400 });
    }

    // 1. Fetch conversation details to get recipient email and subject
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!conversation) {
      return Response.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    // Determine target email
    const toEmail = conversation.contact.email;
    const recipientName = conversation.contact.name;
    const subject = conversation.subject;

    // 2. Resolve threading headers using previous message IDs
    // Find the latest message that had an emailMessageId to link our reply
    const lastEmailMessage = conversation.messages.find(m => m.emailMessageId !== null);
    
    // Config values
    const apiKey = process.env.RESEND_API_KEY;
    const fromDomain = process.env.RESEND_FROM_EMAIL || 'Surya <onboarding@resend.dev>';
    const replyToEmail = process.env.RESEND_INBOUND_EMAIL || 'suryachalam18@gmail.com';

    let emailMessageId: string | undefined;

    if (apiKey) {
      const resend = new Resend(apiKey);
      
      const emailPayload: any = {
        from: fromDomain,
        to: [toEmail],
        replyTo: replyToEmail,
        subject: subject.toLowerCase().startsWith('re:') ? subject : `Re: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6;">
            <div style="white-space: pre-wrap; font-size: 16px; margin-bottom: 24px;">${content}</div>
            
            <p style="margin-top: 32px; color: #64748b;">
              Best regards,<br/>
              <strong>Suryachalam V M</strong><br/>
              <span style="font-size: 13px; color: #94a3b8;">Product Engineer · Bengaluru, India</span>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            <p style="font-size: 10px; color: #94a3b8; text-align: center;">
              Replies to this email will be synced directly back into our active CRM thread.
            </p>
          </div>
        `,
      };

      // Set headers for email clients to thread the conversation
      if (lastEmailMessage?.emailMessageId) {
        emailPayload.headers = {
          'In-Reply-To': lastEmailMessage.emailMessageId,
          'References': lastEmailMessage.emailMessageId,
        };
      }

      // Send the email
      const sentEmail = await resend.emails.send(emailPayload);
      emailMessageId = sentEmail.data?.id || undefined;
    }

    // 3. Save message to database and update status (db.saveCRMReply handles DB logic)
    const replyMessage = await db.saveCRMReply(
      conversationId,
      content,
      'SURYA',
      emailMessageId
    );

    return Response.json(replyMessage);
  } catch (err) {
    console.error('CRM Reply POST error:', err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
