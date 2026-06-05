import { prisma } from './prisma';

// ─── Public Types ─────────────────────────────────────────────────────────────
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'ignored';
}

export interface VisitRecord {
  id: string;
  timestamp: string;
  page: string;
  referrer: string;
  ipHash: string;
}

// ─── Contact Operations ───────────────────────────────────────────────────────
export const db = {
  async saveContactSubmission(
    name: string,
    email: string,
    subject: string,
    message: string
  ): Promise<ContactSubmission> {
    const row = await prisma.contact.create({
      data: { name, email, subject, message, status: 'pending' },
    });
    return toContact(row);
  },

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    const rows = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toContact);
  },

  async updateContactStatus(
    id: string,
    status: 'pending' | 'reviewed' | 'ignored'
  ): Promise<boolean> {
    try {
      await prisma.contact.update({ where: { id }, data: { status } });
      return true;
    } catch {
      return false;
    }
  },

  // ─── Analytics Operations ─────────────────────────────────────────────────
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

    // Unique visitors by IP hash
    const uniqueIPs = new Set(visits.map((v) => v.ipHash));

    // Group page views
    const pageViews: Record<string, number> = {};
    for (const v of visits) {
      pageViews[v.page] = (pageViews[v.page] || 0) + 1;
    }

    // Group referrers (normalise to hostname)
    const referrers: Record<string, number> = {};
    for (const v of visits) {
      let ref = v.referrer;
      try {
        if (ref.startsWith('http')) ref = new URL(ref).hostname;
      } catch { /* leave as-is */ }
      referrers[ref] = (referrers[ref] || 0) + 1;
    }

    // Group project views
    const viewsByProject: Record<string, number> = {};
    for (const pv of projectViews) {
      viewsByProject[pv.projectId] = (viewsByProject[pv.projectId] || 0) + 1;
    }

    // Most recent 10 visits
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toContact(row: {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
}): ContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status as ContactSubmission['status'],
    createdAt: row.createdAt.toISOString(),
  };
}
