import { prisma } from './prisma';

// ─── Public Types ─────────────────────────────────────────────────────────────
export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  linkedin: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  conversations: Array<{
    id: string;
    subject: string;
    lastMessageAt: string;
    messages: Array<{
      id: string;
      senderType: 'CONTACT' | 'SURYA';
      content: string;
      emailMessageId: string | null;
      createdAt: string;
    }>;
  }>;
}

export interface VisitRecord {
  id: string;
  timestamp: string;
  page: string;
  referrer: string;
  ipHash: string;
}

// ─── CRM & Analytics Database Operations ──────────────────────────────────────────
export const db = {
  // ─── Incoming Form Flow ───────────────────────────────────────────────────
  async saveContactSubmission(
    name: string,
    email: string,
    subject: string,
    message: string,
    company?: string,
    role?: string,
    linkedin?: string
  ) {
    // 1. Create or update Contact matching by email
    const contact = await prisma.contact.upsert({
      where: { email },
      update: {
        name, // update name if they use a different spelling
        company: company || null,
        role: role || null,
        linkedin: linkedin || null,
        status: 'NEW', // reset to NEW on a new submission
        updatedAt: new Date(),
      },
      create: {
        name,
        email,
        company: company || null,
        role: role || null,
        linkedin: linkedin || null,
        status: 'NEW',
        source: 'PORTAL',
      },
    });

    // 2. Create Conversation
    const conversation = await prisma.conversation.create({
      data: {
        contactId: contact.id,
        subject,
      },
    });

    // 3. Create first Message
    const msg = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: 'CONTACT',
        content: message,
      },
    });

    // 4. Log Activity
    await prisma.activityLog.create({
      data: {
        action: 'Contact Created',
        metadata: JSON.stringify({
          contactId: contact.id,
          contactName: contact.name,
          conversationId: conversation.id,
          subject,
        }),
      },
    });

    return { contact, conversation, message: msg };
  },

  // ─── CRM Dashboard Actions ────────────────────────────────────────────────
  async getCRMContacts(search?: string, filter?: string, sort: 'recent' | 'oldest' | 'name' = 'recent') {
    let whereClause: any = {};

    if (filter && filter !== 'ALL') {
      whereClause.status = filter;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
        { role: { contains: search } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where: whereClause,
      include: {
        conversations: {
          orderBy: { lastMessageAt: 'desc' },
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    // Sort mappings
    return contacts.sort((a, b) => {
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      
      const timeA = a.conversations[0]?.lastMessageAt?.getTime() ?? a.updatedAt.getTime();
      const timeB = b.conversations[0]?.lastMessageAt?.getTime() ?? b.updatedAt.getTime();

      if (sort === 'oldest') {
        return timeA - timeB;
      }
      return timeB - timeA; // default 'recent'
    });
  },

  async getConversationDetails(contactId: string) {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        conversations: {
          orderBy: { createdAt: 'asc' },
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!contact) return null;

    // Fetch activity logs linked to this contact
    const allLogs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const contactLogs = allLogs.filter((log) => {
      if (!log.metadata) return false;
      try {
        const meta = JSON.parse(log.metadata);
        return meta.contactId === contactId;
      } catch {
        return false;
      }
    });

    return {
      ...contact,
      conversations: contact.conversations.map((c) => ({
        ...c,
        messages: c.messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        })),
        lastMessageAt: c.lastMessageAt.toISOString(),
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
      activityLogs: contactLogs.map(l => ({
        id: l.id,
        action: l.action,
        metadata: l.metadata,
        createdAt: l.createdAt.toISOString()
      })),
    };
  },

  async saveCRMReply(conversationId: string, content: string, senderType: 'CONTACT' | 'SURYA' = 'SURYA', emailMessageId?: string) {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderType,
        content,
        emailMessageId: emailMessageId || null,
      },
    });

    // Update conversation lastMessageAt timer
    const conversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
      include: { contact: true },
    });

    // Auto update contact status to REPLIED when Surya responds, or CONTACTED
    const newStatus = senderType === 'SURYA' ? 'REPLIED' : 'NEW';
    await prisma.contact.update({
      where: { id: conversation.contactId },
      data: { status: newStatus, updatedAt: new Date() },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        action: senderType === 'SURYA' ? 'Email Sent' : 'Reply Received',
        metadata: JSON.stringify({
          contactId: conversation.contactId,
          conversationId,
          messageId: message.id,
          emailMessageId: emailMessageId || null,
        }),
      },
    });

    return message;
  },

  async updateContactStatus(id: string, status: string) {
    try {
      const oldContact = await prisma.contact.findUnique({ where: { id } });
      await prisma.contact.update({
        where: { id },
        data: { status, updatedAt: new Date() },
      });

      await prisma.activityLog.create({
        data: {
          action: 'Status Changed',
          metadata: JSON.stringify({
            contactId: id,
            oldStatus: oldContact?.status,
            newStatus: status,
          }),
        },
      });
      return true;
    } catch {
      return false;
    }
  },

  async saveContactNotes(id: string, notes: string) {
    try {
      await prisma.contact.update({
        where: { id },
        data: { notes, updatedAt: new Date() },
      });
      await prisma.activityLog.create({
        data: {
          action: 'Notes Updated',
          metadata: JSON.stringify({
            contactId: id,
          }),
        },
      });
      return true;
    } catch {
      return false;
    }
  },

  async getCRMAnalytics() {
    const [contacts, conversations] = await Promise.all([
      prisma.contact.findMany(),
      prisma.conversation.findMany({
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
    ]);

    const totalContacts = contacts.length;
    const closed = contacts.filter((c) => c.status === 'CLOSED').length;
    const opportunities = contacts.filter((c) => c.status === 'OPPORTUNITY').length;
    const interviews = contacts.filter((c) => c.status === 'INTERVIEW').length;

    // Active conversations are those not CLOSED and not NEW
    const activeConversations = contacts.filter(
      (c) => c.status !== 'CLOSED' && c.status !== 'NEW'
    ).length;

    // Response rate: percentage of conversations that have at least one message from SURYA
    const conversationsWithReplies = conversations.filter((c) =>
      c.messages.some((m) => m.senderType === 'SURYA')
    ).length;
    const responseRate =
      conversations.length > 0
        ? Math.round((conversationsWithReplies / conversations.length) * 100)
        : 100;

    // Average Response Time: for conversations with replies, time diff between first CONTACT msg and first SURYA msg
    let totalDiffMs = 0;
    let repliedCount = 0;

    for (const c of conversations) {
      const firstContact = c.messages.find((m) => m.senderType === 'CONTACT');
      const firstSurya = c.messages.find((m) => m.senderType === 'SURYA');

      if (firstContact && firstSurya) {
        const diff = firstSurya.createdAt.getTime() - firstContact.createdAt.getTime();
        // Ignore negative offsets or outliers
        if (diff > 0) {
          totalDiffMs += diff;
          repliedCount++;
        }
      }
    }

    let avgResponseTimeStr = 'No replies yet';
    if (repliedCount > 0) {
      const avgMinutes = Math.round(totalDiffMs / 1000 / 60);
      if (avgMinutes < 60) {
        avgResponseTimeStr = `${avgMinutes}m`;
      } else if (avgMinutes < 1440) {
        const hours = Math.floor(avgMinutes / 60);
        const mins = avgMinutes % 60;
        avgResponseTimeStr = `${hours}h ${mins}m`;
      } else {
        const days = (avgMinutes / 1440).toFixed(1);
        avgResponseTimeStr = `${days} days`;
      }
    }

    // Funnel count aggregator
    const funnelStages = {
      NEW: contacts.filter(c => c.status === 'NEW').length,
      CONTACTED: contacts.filter(c => c.status === 'CONTACTED').length,
      REPLIED: contacts.filter(c => c.status === 'REPLIED').length,
      NETWORKING: contacts.filter(c => c.status === 'NETWORKING').length,
      INTERVIEW: contacts.filter(c => c.status === 'INTERVIEW').length,
      OPPORTUNITY: contacts.filter(c => c.status === 'OPPORTUNITY').length,
      CLOSED: contacts.filter(c => c.status === 'CLOSED').length,
    };

    return {
      totalContacts,
      activeConversations,
      opportunities,
      interviews,
      closed,
      responseRate,
      avgResponseTimeStr,
      funnelStages,
    };
  },

  async getActivityLogs() {
    return prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  // ─── Core Site Analytics Operations (Preserved) ───────────────────────────
  async trackVisit(page: string, referrer: string, _userAgent: string, ipHash: string): Promise<void> {
    await prisma.visit.create({
      data: { page, referrer: referrer || 'direct', ipHash },
    });
  },

  async trackDownload(): Promise<void> {
    await prisma.resumeDownload.create({ data: {} });
  },

  async trackProjectView(projectId: string): Promise<void> {
    await prisma.projectView.create({ data: { projectId } });
  },

  async getAnalyticsSummary() {
    const [contacts, visits, downloads, projectViews] = await Promise.all([
      prisma.contact.count(),
      prisma.visit.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.resumeDownload.count(),
      prisma.projectView.findMany(),
    ]);

    const uniqueIPs = new Set(visits.map((v) => v.ipHash));

    const pageViews: Record<string, number> = {};
    for (const v of visits) {
      pageViews[v.page] = (pageViews[v.page] || 0) + 1;
    }

    const referrers: Record<string, number> = {};
    for (const v of visits) {
      let ref = v.referrer;
      try {
        if (ref.startsWith('http')) ref = new URL(ref).hostname;
      } catch { /* ignored */ }
      referrers[ref] = (referrers[ref] || 0) + 1;
    }

    const viewsByProject: Record<string, number> = {};
    for (const pv of projectViews) {
      viewsByProject[pv.projectId] = (viewsByProject[pv.projectId] || 0) + 1;
    }

    const recentVisits: VisitRecord[] = visits.slice(0, 10).map((v) => ({
      id: v.id,
      timestamp: v.createdAt.toISOString(),
      page: v.page,
      referrer: v.referrer,
      ipHash: v.ipHash,
    }));

    return {
      totalVisitors: uniqueIPs.size,
      totalPageViews: visits.length,
      totalDownloads: downloads,
      totalContacts: contacts,
      pageViews,
      referrers,
      viewsByProject,
      recentVisits,
    };
  },
};
