"use client";

import { useState, useCallback } from "react";

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
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const statusColor = {
  pending: "border-[#FFD700] text-[#FFD700] bg-[#1a1400]",
  reviewed: "border-[#00FF41] text-[#00FF41] bg-[#001a00]",
  ignored: "border-[#E3000F] text-[#E3000F] bg-[#1a0000]",
};

function StatusBadge({ status }: { status: Contact["status"] }) {
  return (
    <span
      className={`font-mono text-xs border px-2 py-0.5 uppercase ${statusColor[status]}`}
    >
      {status}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const [analyticsRes, contactsRes] = await Promise.all([
        fetch("/api/admin/analytics", { headers: { "x-admin-password": pw } }),
        fetch("/api/admin/contacts", { headers: { "x-admin-password": pw } }),
      ]);

      if (analyticsRes.status === 401 || contactsRes.status === 401) {
        setAuthed(false);
        setAuthError("Incorrect password.");
        return;
      }

      if (!analyticsRes.ok || !contactsRes.ok) {
        setAuthed(false);
        setAuthError(
          `Server/Database error (Analytics: ${analyticsRes.status}, Contacts: ${contactsRes.status}).`
        );
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

    if (!res.ok) {
      setAuthError(
        `Server/Database error: ${res.status}. Please check server console logs.`
      );
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
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  // ─── Login Screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="border-2 border-[#E3000F] bg-[#141414] shadow-[6px_6px_0px_#E3000F] p-8 w-full max-w-sm flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 bg-[#E3000F] border border-[#E3000F] inline-block" />
              <h1 className="font-black text-2xl uppercase text-white tracking-tight">
                ADMIN ACCESS
              </h1>
            </div>
            <p className="font-mono text-xs text-[#888]">
              Restricted. Authorised personnel only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                className="border-2 border-[#E3000F] bg-[#0A0A0A] text-white font-mono text-sm px-4 py-3 w-full rounded-none focus:outline-none focus:shadow-[4px_4px_0px_#E3000F] placeholder:text-[#444] transition-all"
                placeholder="ENTER PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#E3000F] text-white border-2 border-[#E3000F] font-black uppercase px-6 py-3 w-full rounded-none shadow-[3px_3px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#fff] transition-all tracking-widest disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "AUTHENTICATE →"}
            </button>
          </form>

          {authError && (
            <p className="font-mono text-xs text-[#E3000F] border border-[#E3000F] bg-[#1a0000] px-3 py-2">
              ACCESS DENIED - {authError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-10 font-medium">
      <header className="border-b-2 border-[#E3000F] bg-[#0A0A0A] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-[#E3000F] inline-block" />
          <span className="font-black text-white uppercase tracking-tight text-lg">
            SGK / ADMIN
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#888] hidden sm:inline">
            AUTHENTICATED
          </span>
          <span className="w-2 h-2 bg-[#00FF41] inline-block animate-pulse" />
          <button
            onClick={() => {
              setAuthed(false);
              setPassword("");
            }}
            className="font-mono text-xs text-[#E3000F] border border-[#E3000F] px-3 py-1 hover:bg-[#E3000F] hover:text-white transition-all rounded-none"
          >
            LOGOUT
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 space-y-8">
        {!analytics && loading && (
          <div className="mx-6 border-2 border-[#E3000F] bg-[#141414] p-5 animate-pulse">
            <div className="h-3 bg-[#1E1E1E] w-24 mb-3" />
            <div className="h-8 bg-[#1E1E1E] w-16" />
          </div>
        )}

        {authError && (
          <div className="font-mono text-xs text-[#E3000F] border border-[#E3000F] bg-[#1a0000] px-4 py-3 mx-6">
            ⚠ FAILED TO FETCH — {authError}
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
            <div className="border-2 border-[#E3000F] bg-[#141414] shadow-[4px_4px_0px_#E3000F] p-5">
              <p className="font-mono text-xs text-[#888] uppercase tracking-widest mb-2">
                TOTAL VISITS
              </p>
              <p className="font-black text-4xl text-white">
                {analytics.totalVisitors}
              </p>
              <p className="font-mono text-xs text-[#E3000F] mt-1">↑ all time</p>
            </div>
            <div className="border-2 border-[#E3000F] bg-[#141414] shadow-[4px_4px_0px_#E3000F] p-5">
              <p className="font-mono text-xs text-[#888] uppercase tracking-widest mb-2">
                PAGE VIEWS
              </p>
              <p className="font-black text-4xl text-white">
                {analytics.totalPageViews}
              </p>
              <p className="font-mono text-xs text-[#E3000F] mt-1">↑ all time</p>
            </div>
            <div className="border-2 border-[#E3000F] bg-[#141414] shadow-[4px_4px_0px_#E3000F] p-5">
              <p className="font-mono text-xs text-[#888] uppercase tracking-widest mb-2">
                DOWNLOADS
              </p>
              <p className="font-black text-4xl text-white">
                {analytics.totalDownloads}
              </p>
              <p className="font-mono text-xs text-[#E3000F] mt-1">↑ resumes</p>
            </div>
            <div className="border-2 border-[#E3000F] bg-[#141414] shadow-[4px_4px_0px_#E3000F] p-5">
              <p className="font-mono text-xs text-[#888] uppercase tracking-widest mb-2">
                MESSAGES
              </p>
              <p className="font-black text-4xl text-white">
                {analytics.totalContacts}
              </p>
              <p className="font-mono text-xs text-[#E3000F] mt-1">↑ received</p>
            </div>
          </div>
        )}

        {analytics && (
          <div className="grid md:grid-cols-2 gap-6 px-6">
            <div className="border-2 border-[#E3000F] bg-[#141414] shadow-[4px_4px_0px_#E3000F]">
              <div className="border-b-2 border-[#E3000F] px-5 py-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#E3000F] inline-block" />
                <h2 className="font-black text-sm uppercase text-white tracking-widest">
                  RECENT VISITS
                </h2>
              </div>
              <div className="divide-y divide-[#1E1E1E]">
                {analytics.recentVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="px-5 py-3 flex justify-between items-center hover:bg-[#1E1E1E] transition-colors"
                  >
                    <span className="font-mono text-sm text-white max-w-[40%] truncate">
                      {visit.page}
                    </span>
                    <span className="font-mono text-xs text-[#888] max-w-[30%] truncate">
                      {visit.referrer || "direct"}
                    </span>
                    <span className="font-mono text-xs text-[#E3000F]">
                      {formatDate(visit.timestamp)}
                    </span>
                  </div>
                ))}
                {analytics.recentVisits.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <p className="font-mono text-sm text-[#444] uppercase tracking-widest">
                      [ NO VISITS ]
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-2 border-[#E3000F] bg-[#141414] shadow-[4px_4px_0px_#E3000F]">
              <div className="border-b-2 border-[#E3000F] px-5 py-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#E3000F] inline-block" />
                <h2 className="font-black text-sm uppercase text-white tracking-widest">
                  TOP REFERRERS
                </h2>
              </div>
              <div className="divide-y divide-[#1E1E1E]">
                {Object.entries(analytics.referrers)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([referrer, count]) => (
                    <div
                      key={referrer}
                      className="px-5 py-3 flex justify-between items-center hover:bg-[#1E1E1E] transition-colors"
                    >
                      <span className="font-mono text-sm text-white max-w-[70%] truncate">
                        {referrer}
                      </span>
                      <span className="font-mono text-xs text-[#E3000F]">
                        {count} VISITS
                      </span>
                    </div>
                  ))}
                {Object.keys(analytics.referrers).length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <p className="font-mono text-sm text-[#444] uppercase tracking-widest">
                      [ NO REFERRERS ]
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="border-2 border-[#E3000F] bg-[#141414] shadow-[4px_4px_0px_#E3000F] mx-6 mb-6">
          <div className="border-b-2 border-[#E3000F] px-5 py-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#E3000F] inline-block" />
            <h2 className="font-black text-sm uppercase text-white tracking-widest">
              MESSAGES
            </h2>
            <span className="ml-auto font-mono text-xs text-[#E3000F] border border-[#E3000F] px-2 py-0.5">
              {contacts.length} TOTAL
            </span>
          </div>

          <div className="divide-y divide-[#1E1E1E]">
            {contacts.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p className="font-mono text-sm text-[#444] uppercase tracking-widest">
                  [ NO MESSAGES ]
                </p>
              </div>
            )}
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="px-5 py-4 hover:bg-[#1E1E1E] transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
              >
                {/* Name + Email */}
                <div className="md:col-span-3">
                  <p className="font-bold text-white text-sm">
                    {contact.name}
                  </p>
                  <p className="font-mono text-xs text-[#888]">
                    {contact.email}
                  </p>
                </div>
                {/* Subject */}
                <div className="md:col-span-3">
                  <p className="font-medium text-white text-sm">
                    {contact.subject}
                  </p>
                </div>
                {/* Message preview */}
                <div className="md:col-span-3">
                  <p className="font-mono text-xs text-[#888] line-clamp-2">
                    {contact.message}
                  </p>
                </div>
                {/* Date */}
                <div className="md:col-span-1">
                  <p className="font-mono text-xs text-[#E3000F]">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
                {/* Status badge + action */}
                <div className="md:col-span-2 flex flex-col gap-2 items-start md:items-end">
                  <StatusBadge status={contact.status} />
                  {contact.status !== "reviewed" && (
                    <button
                      onClick={() => updateStatus(contact.id, "reviewed")}
                      className="font-mono text-xs border border-[#888] text-[#888] px-2 py-0.5 hover:border-[#00FF41] hover:text-[#00FF41] hover:bg-[#001a00] transition-all rounded-none uppercase"
                    >
                      MARK REVIEWED
                    </button>
                  )}
                  {contact.status !== "ignored" && contact.status !== "reviewed" && (
                    <button
                      onClick={() => updateStatus(contact.id, "ignored")}
                      className="font-mono text-xs border border-[#888] text-[#888] px-2 py-0.5 hover:border-[#E3000F] hover:text-[#E3000F] hover:bg-[#1a0000] transition-all rounded-none uppercase mt-1"
                    >
                      IGNORE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
