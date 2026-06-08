import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { prisma } from '@/lib/prisma';

// Helper to extract clean email address from "Name <email@domain.com>" or "email@domain.com"
function extractEmail(fromHeader: string): string | null {
  const match = fromHeader.match(/<([^>]+)>/);
  if (match && match[1]) {
    return match[1].trim().toLowerCase();
  }
  const directMatch = fromHeader.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return directMatch ? directMatch[0].trim().toLowerCase() : null;
}

// Helper to clean message IDs (removes angle brackets)
function cleanMessageId(id: string | null | undefined): string | null {
  if (!id) return null;
  return id.replace(/[<>]/g, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    console.log('Received Inbound Email Webhook:', JSON.stringify(rawBody));

    // Handle webhook secret authorization if configured
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const authHeader = req.headers.get('Authorization');
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return Response.json({ error: 'Unauthorized webhook request.' }, { status: 401 });
    }

    // Support both Resend wrapped payloads ({ type, data }) and raw payloads
    const emailData = rawBody.data && rawBody.type === 'email.received' ? rawBody.data : rawBody;
    const emailId = emailData.email_id || emailData.id;

    const fromHeader = emailData.from || '';
    const subject = emailData.subject || 'No Subject';
    let textContent = emailData.text || emailData.html || 'No content';
    let headers = emailData.headers || {};

    const recruiterEmail = extractEmail(fromHeader);
    if (!recruiterEmail) {
      console.error('Failed to parse recruiter email address from:', fromHeader);
      return Response.json({ error: 'Invalid sender email.' }, { status: 400 });
    }

    // Resolve Message IDs for threading
    // Resend webhooks put headers in standard fields, or headers object
    let messageId = cleanMessageId(emailData.messageId || headers['Message-ID'] || headers['message-id']);
    let inReplyTo = cleanMessageId(emailData.inReplyTo || headers['In-Reply-To'] || headers['in-reply-to']);

    // Fetch full email content from Resend API if API key is set and we have an email ID
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && emailId) {
      try {
        const resend = new Resend(apiKey);
        const { data: fullEmail, error } = await resend.emails.receiving.get(emailId);
        if (error) {
          console.error('Failed to retrieve receiving email content from Resend API:', error);
        } else if (fullEmail) {
          console.log('Successfully retrieved full email details for ID:', emailId);
          textContent = fullEmail.text || fullEmail.html || textContent;
          const fullHeaders = (fullEmail.headers || {}) as Record<string, any>;
          messageId = cleanMessageId(fullEmail.message_id) || cleanMessageId(fullHeaders['Message-ID'] || fullHeaders['message-id']) || messageId;
          inReplyTo = cleanMessageId(fullHeaders['In-Reply-To'] || fullHeaders['in-reply-to']) || inReplyTo;
        }
      } catch (fetchErr) {
        console.error('Error fetching receiving email details from Resend API:', fetchErr);
      }
    }

    let resolvedConversationId: string | null = null;
    let resolvedContactId: string | null = null;

    // 1. Thread matching by In-Reply-To header
    if (inReplyTo) {
      const matchedMessage = await prisma.message.findFirst({
        where: { emailMessageId: inReplyTo },
        include: { conversation: true },
      });
      if (matchedMessage) {
        resolvedConversationId = matchedMessage.conversationId;
        resolvedContactId = matchedMessage.conversation.contactId;
        console.log(`Matched reply to active Conversation: ${resolvedConversationId} via In-Reply-To: ${inReplyTo}`);
      }
    }

    // 2. Fallback matching by Contact Email address
    if (!resolvedConversationId) {
      const contact = await prisma.contact.findUnique({
        where: { email: recruiterEmail },
        include: {
          conversations: {
            orderBy: { lastMessageAt: 'desc' },
            take: 1,
          },
        },
      });

      if (contact) {
        resolvedContactId = contact.id;
        const lastConv = contact.conversations[0];
        if (lastConv) {
          resolvedConversationId = lastConv.id;
          console.log(`Matched reply to Contact's most recent active Conversation: ${resolvedConversationId}`);
        } else {
          // Contact exists but has no conversations (edge case)
          const newConv = await prisma.conversation.create({
            data: {
              contactId: contact.id,
              subject: subject.replace(/^Re:\s*/i, ''),
            },
          });
          resolvedConversationId = newConv.id;
          console.log(`Created new Conversation: ${resolvedConversationId} for existing Contact`);
        }
      } else {
        // 3. Contact does not exist - completely new sender cold-emailing our domain
        const cleanName = fromHeader.split('<')[0]?.trim() || recruiterEmail.split('@')[0];
        const newContact = await prisma.contact.create({
          data: {
            name: cleanName,
            email: recruiterEmail,
            status: 'NEW',
            source: 'INBOUND_EMAIL',
          },
        });
        resolvedContactId = newContact.id;

        const newConv = await prisma.conversation.create({
          data: {
            contactId: newContact.id,
            subject: subject.replace(/^Re:\s*/i, ''),
          },
        });
        resolvedConversationId = newConv.id;
        console.log(`Created new Contact (${newContact.id}) and Conversation (${newConv.id}) for cold incoming email`);
      }
    }

    if (!resolvedConversationId || !resolvedContactId) {
      throw new Error('Resolution failed: unable to map message components.');
    }

    // 4. Save reply and update contact status
    await db.saveCRMReply(
      resolvedConversationId,
      textContent,
      'CONTACT',
      messageId || undefined
    );

    // Update Contact status to NEW so they trigger notification indicators in Surya's Admin panel
    await prisma.contact.update({
      where: { id: resolvedContactId },
      data: { status: 'NEW', updatedAt: new Date() },
    });

    // Send internal alert email to Surya notifying them of the incoming reply
    const fromDomain = process.env.RESEND_FROM_EMAIL || 'Portfolio Webhook <onboarding@resend.dev>';
    if (apiKey) {
      const resend = new Resend(apiKey);
      const contactName = fromHeader.split('<')[0]?.trim() || recruiterEmail;

      await resend.emails.send({
        from: fromDomain,
        to: ['suryachalam18@gmail.com'],
        subject: `[CRM Reply] Re: ${subject} from ${contactName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #1e293b;">
            <h2 style="color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New CRM Message</h2>
            <p><strong>From:</strong> ${fromHeader}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${textContent}</div>
            <p style="margin-top: 25px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/admin/crm?id=${resolvedContactId}" 
                 style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reply in CRM Dashboard
              </a>
            </p>
          </div>
        `,
      });
    }

    return Response.json({ success: true, conversationId: resolvedConversationId });
  } catch (err) {
    console.error('Inbound email webhook error:', err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
