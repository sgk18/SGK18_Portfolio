"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Download,
  Mail,
  Eye,
  BarChart2,
  RefreshCw,
  Lock,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  totalDownloads: number;
  totalContacts: number;
  pageViews: Record<string, number>;
  referrers: Record<string, number>;
  viewsByProject: Record<string, number>;
  recentVisits: Array<{
    id: string;
    timestamp: string;
    page: string;
    referrer: string;
  }>;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "pending" | "reviewed" | "ignored";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-[#0d0d18] rounded-2xl p-6 border border-slate-800">
      <div className={`inline-flex p-2.5 rounded-xl mb-4 ${color}`}>{icon}</div>
      <p className="text-3xl font-bold text-slate-100 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock size={14} className="text-amber-400" />,
  reviewed: <CheckCircle size={14} className="text-emerald-400" />,
  ignored: <XCircle size={14} className="text-slate-500" />,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "contacts">("overview");

  const fetchData = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const [analyticsRes, contactsRes] = await Promise.all([
        fetch("/api/admin/analytics", { headers: { "x-admin-password": pw } }),
        fetch("/api/admin/contacts", { headers: { "x-admin-password": pw } }),
      ]);

      if (!analyticsRes.ok || !contactsRes.ok) {
        setAuthed(false);
        setAuthError("Invalid password.");
        return;
      }

      setAnalytics(await analyticsRes.json());
      setContacts(await contactsRes.json());
    } catch {
      setAuthError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    const res = await fetch("/api/admin/analytics", {
      headers: { "x-admin-password": password },
    });

    if (res.status === 401) {
      setAuthError("Incorrect password.");
      setLoading(false);
      return;
    }

    setAuthed(true);
    await fetchData(password);
  };

  const updateStatus = async (id: string, status: Contact["status"]) => {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id, status }),
    });
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  // ─── Login Screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#09090e] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Lock size={20} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Recruiter analytics & contact management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-400 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl bg-[#0d0d18] border border-slate-800 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                required
              />
              {authError && <p className="text-rose-400 text-xs mt-1.5">{authError}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-semibold text-sm transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Default password: <code className="text-slate-500">admin123</code> — set{" "}
            <code className="text-slate-500">ADMIN_PASSWORD</code> env var in production.
          </p>
        </div>
      </div>
    );
  }

  // ─── Dashboard ──────────────────────────────────────────────────────────────
  const pendingContacts = contacts.filter((c) => c.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#09090e] text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#09090e]/90 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart2 size={20} className="text-indigo-400" />
          <span className="font-bold text-slate-100">Portfolio Analytics</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            live
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(password)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 text-xs transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => { setAuthed(false); setPassword(""); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 text-xs transition-colors"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Stat Cards */}
        {analytics && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Unique Visitors"
              value={analytics.totalVisitors}
              icon={<Users size={18} className="text-indigo-400" />}
              color="bg-indigo-500/10"
            />
            <StatCard
              label="Resume Downloads"
              value={analytics.totalDownloads}
              icon={<Download size={18} className="text-emerald-400" />}
              color="bg-emerald-500/10"
            />
            <StatCard
              label="Contact Requests"
              value={analytics.totalContacts}
              icon={<Mail size={18} className="text-amber-400" />}
              color="bg-amber-500/10"
            />
            <StatCard
              label="Total Page Views"
              value={analytics.totalPageViews}
              icon={<Eye size={18} className="text-purple-400" />}
              color="bg-purple-500/10"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-800 w-fit">
          {(["overview", "contacts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
              {tab === "contacts" && pendingContacts > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                  {pendingContacts}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && analytics && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Page Views */}
            <div className="md:col-span-1 bg-[#0d0d18] rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                Page Views
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.pageViews)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([page, count]) => {
                    const max = Math.max(...Object.values(analytics.pageViews));
                    return (
                      <div key={page} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-mono truncate max-w-[60%]">{page}</span>
                          <span className="text-slate-300 font-semibold">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${(count / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(analytics.pageViews).length === 0 && (
                  <p className="text-slate-600 text-sm text-center py-4">No page view data yet.</p>
                )}
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-[#0d0d18] rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                Top Referrers
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.referrers)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([referrer, count]) => (
                    <div key={referrer} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-mono truncate max-w-[70%]">{referrer}</span>
                      <span className="text-slate-200 font-semibold">{count}</span>
                    </div>
                  ))}
                {Object.keys(analytics.referrers).length === 0 && (
                  <p className="text-slate-600 text-sm text-center py-4">No referrer data yet.</p>
                )}
              </div>
            </div>

            {/* Most Viewed Projects */}
            <div className="bg-[#0d0d18] rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                Project Views
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.viewsByProject)
                  .sort(([, a], [, b]) => b - a)
                  .map(([project, count]) => (
                    <div key={project} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-mono truncate max-w-[70%]">{project}</span>
                      <span className="text-slate-200 font-semibold">{count}</span>
                    </div>
                  ))}
                {Object.keys(analytics.viewsByProject).length === 0 && (
                  <p className="text-slate-600 text-sm text-center py-4">No project views yet.</p>
                )}
              </div>
            </div>

            {/* Recent Visits */}
            <div className="md:col-span-3 bg-[#0d0d18] rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                Recent Visits
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-600 border-b border-slate-800">
                      <th className="pb-3 font-mono">Time</th>
                      <th className="pb-3 font-mono">Page</th>
                      <th className="pb-3 font-mono">Referrer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {analytics.recentVisits.map((v) => (
                      <tr key={v.id}>
                        <td className="py-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                          {new Date(v.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 text-slate-300 font-mono text-xs">{v.page}</td>
                        <td className="py-3 text-slate-500 font-mono text-xs truncate max-w-[200px]">
                          {v.referrer}
                        </td>
                      </tr>
                    ))}
                    {analytics.recentVisits.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-slate-600 text-sm">
                          No visits tracked yet. The tracker fires on your first page load.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="space-y-4">
            {contacts.length === 0 && (
              <div className="bg-[#0d0d18] rounded-2xl p-10 border border-slate-800 text-center text-slate-600">
                No contact submissions yet.
              </div>
            )}
            {contacts.map((c) => (
              <div
                key={c.id}
                className={`bg-[#0d0d18] rounded-2xl p-6 border transition-colors ${
                  c.status === "pending" ? "border-amber-500/20" : "border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcons[c.status]}
                      <span className="font-semibold text-slate-200">{c.name}</span>
                      <span className="text-slate-500 text-sm">·</span>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-indigo-400 text-sm hover:text-indigo-300"
                      >
                        {c.email}
                      </a>
                    </div>
                    <p className="text-sm font-medium text-slate-300">{c.subject}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {(["pending", "reviewed", "ignored"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(c.id, s)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all capitalize ${
                          c.status === s
                            ? s === "pending"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : s === "reviewed"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                            : "bg-transparent text-slate-600 border border-slate-800 hover:border-slate-700 hover:text-slate-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3 mt-3">
                  {c.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
