import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Types for our database records
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
  userAgent: string;
  ipHash: string;
}

export interface DownloadRecord {
  id: string;
  timestamp: string;
}

export interface ProjectViewRecord {
  id: string;
  projectId: string;
  timestamp: string;
}

interface LocalDBSchema {
  contacts: ContactSubmission[];
  visits: VisitRecord[];
  downloads: DownloadRecord[];
  projectViews: ProjectViewRecord[];
}

const LOCAL_DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Initialize local JSON DB if it doesn't exist
function initLocalDB(): LocalDBSchema {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const initialData: LocalDBSchema = {
      contacts: [],
      visits: [],
      downloads: [],
      projectViews: [],
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to read local DB, resetting:', e);
    const initialData: LocalDBSchema = {
      contacts: [],
      visits: [],
      downloads: [],
      projectViews: [],
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function writeLocalDB(data: LocalDBSchema) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Check if Supabase configuration is present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null;

export const db = {
  isSupabase: isSupabaseConfigured,

  // Contact Operations
  async saveContactSubmission(name: string, email: string, subject: string, message: string): Promise<ContactSubmission> {
    const newSubmission: ContactSubmission = {
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            id: newSubmission.id,
            name: newSubmission.name,
            email: newSubmission.email,
            subject: newSubmission.subject,
            message: newSubmission.message,
            created_at: newSubmission.createdAt,
            status: newSubmission.status,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase save error, falling back to local file:', error);
      } else if (data && data[0]) {
        return {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          subject: data[0].subject,
          message: data[0].message,
          createdAt: data[0].created_at,
          status: data[0].status,
        };
      }
    }

    // Local file fallback
    const localData = initLocalDB();
    localData.contacts.push(newSubmission);
    writeLocalDB(localData);
    return newSubmission;
  },

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          subject: row.subject,
          message: row.message,
          createdAt: row.created_at,
          status: row.status,
        }));
      }
      console.error('Supabase fetch error, falling back to local file:', error);
    }

    const localData = initLocalDB();
    return [...localData.contacts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async updateContactStatus(id: string, status: 'pending' | 'reviewed' | 'ignored'): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id);

      if (!error) return true;
      console.error('Supabase update error, falling back to local file:', error);
    }

    const localData = initLocalDB();
    const contact = localData.contacts.find((c) => c.id === id);
    if (contact) {
      contact.status = status;
      writeLocalDB(localData);
      return true;
    }
    return false;
  },

  // Analytics Operations
  async trackVisit(page: string, referrer: string, userAgent: string, ipHash: string): Promise<void> {
    const newVisit: VisitRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      page,
      referrer: referrer || 'direct',
      userAgent,
      ipHash,
    };

    if (supabase) {
      const { error } = await supabase.from('visits').insert([
        {
          id: newVisit.id,
          timestamp: newVisit.timestamp,
          page: newVisit.page,
          referrer: newVisit.referrer,
          user_agent: newVisit.userAgent,
          ip_hash: newVisit.ipHash,
        },
      ]);
      if (!error) return;
      console.error('Supabase track visit error:', error);
    }

    const localData = initLocalDB();
    localData.visits.push(newVisit);
    writeLocalDB(localData);
  },

  async trackDownload(): Promise<void> {
    const newDownload: DownloadRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from('downloads').insert([
        {
          id: newDownload.id,
          timestamp: newDownload.timestamp,
        },
      ]);
      if (!error) return;
      console.error('Supabase track download error:', error);
    }

    const localData = initLocalDB();
    localData.downloads.push(newDownload);
    writeLocalDB(localData);
  },

  async trackProjectView(projectId: string): Promise<void> {
    const newView: ProjectViewRecord = {
      id: crypto.randomUUID(),
      projectId,
      timestamp: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from('project_views').insert([
        {
          id: newView.id,
          project_id: newView.projectId,
          timestamp: newView.timestamp,
        },
      ]);
      if (!error) return;
      console.error('Supabase track project view error:', error);
    }

    const localData = initLocalDB();
    localData.projectViews.push(newView);
    writeLocalDB(localData);
  },

  async getAnalyticsSummary() {
    let contactsCount = 0;
    let visitsList: VisitRecord[] = [];
    let downloadsList: DownloadRecord[] = [];
    let projectViewsList: ProjectViewRecord[] = [];

    if (supabase) {
      try {
        const [contactsRes, visitsRes, downloadsRes, projectViewsRes] = await Promise.all([
          supabase.from('contacts').select('id', { count: 'exact' }),
          supabase.from('visits').select('*'),
          supabase.from('downloads').select('*'),
          supabase.from('project_views').select('*'),
        ]);

        if (!contactsRes.error && contactsRes.count !== null) {
          contactsCount = contactsRes.count;
        }
        if (!visitsRes.error && visitsRes.data) {
          visitsList = visitsRes.data.map(v => ({
            id: v.id,
            timestamp: v.timestamp,
            page: v.page,
            referrer: v.referrer,
            userAgent: v.user_agent,
            ipHash: v.ip_hash
          }));
        }
        if (!downloadsRes.error && downloadsRes.data) {
          downloadsList = downloadsRes.data;
        }
        if (!projectViewsRes.error && projectViewsRes.data) {
          projectViewsList = projectViewsRes.data.map(pv => ({
            id: pv.id,
            projectId: pv.project_id,
            timestamp: pv.timestamp
          }));
        }

        if (!contactsRes.error && !visitsRes.error && !downloadsRes.error && !projectViewsRes.error) {
          return compileSummary(contactsCount, visitsList, downloadsList, projectViewsList);
        }
      } catch (e) {
        console.error('Failed to get Supabase analytics summary, falling back to local file:', e);
      }
    }

    // Local Fallback
    const localData = initLocalDB();
    contactsCount = localData.contacts.length;
    visitsList = localData.visits;
    downloadsList = localData.downloads;
    projectViewsList = localData.projectViews;

    return compileSummary(contactsCount, visitsList, downloadsList, projectViewsList);
  },
};

function compileSummary(
  contactsCount: number,
  visits: VisitRecord[],
  downloads: DownloadRecord[],
  projectViews: ProjectViewRecord[]
) {
  // Total metrics
  const totalVisitors = new Set(visits.map((v) => v.ipHash)).size;
  const totalPageViews = visits.length;
  const totalDownloads = downloads.length;

  // Group visits by page
  const pageViews: Record<string, number> = {};
  visits.forEach((v) => {
    pageViews[v.page] = (pageViews[v.page] || 0) + 1;
  });

  // Group visits by referrer
  const referrers: Record<string, number> = {};
  visits.forEach((v) => {
    let ref = v.referrer;
    try {
      if (ref.startsWith('http')) {
        ref = new URL(ref).hostname;
      }
    } catch {}
    referrers[ref] = (referrers[ref] || 0) + 1;
  });

  // Group project views by projectId
  const viewsByProject: Record<string, number> = {};
  projectViews.forEach((pv) => {
    viewsByProject[pv.projectId] = (viewsByProject[pv.projectId] || 0) + 1;
  });

  // Latest 10 visits
  const recentVisits = [...visits]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return {
    totalVisitors,
    totalPageViews,
    totalDownloads,
    totalContacts: contactsCount,
    pageViews,
    referrers,
    viewsByProject,
    recentVisits,
  };
}
