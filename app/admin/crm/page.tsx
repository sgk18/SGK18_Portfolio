"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Inbox,
  Send,
  Save,
  Search,
  Linkedin,
  Clock,
  ArrowRight,
  Lock,
  LogOut,
  RefreshCw,
  Briefcase,
  User,
  CheckCircle,
  FileText,
  AlertCircle,
  BarChart2,
  ListFilter,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// ─── CRM Interfaces ─────────────────────────────────────────────────────────
interface Message {
  id: string;
  senderType: "CONTACT" | "SURYA";
  content: string;
  emailMessageId: string | null;
  createdAt: string;
}

interface Conversation {
  id: string;
  subject: string;
  lastMessageAt: string;
  messages: Message[];
}

interface ActivityLog {
  id: string;
  action: string;
  metadata: string | null;
  createdAt: string;
}

interface Contact {
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
  conversations: Conversation[];
  activityLogs?: ActivityLog[];
}

interface CRMAnalytics {
  totalContacts: number;
  activeConversations: number;
  opportunities: number;
  interviews: number;
  closed: number;
  responseRate: number;
  avgResponseTimeStr: string;
  funnelStages: {
    NEW: number;
    CONTACTED: number;
    REPLIED: number;
    NETWORKING: number;
    INTERVIEW: number;
    OPPORTUNITY: number;
    CLOSED: number;
  };
}

// ─── Constants ──────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "NEW", label: "New", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { value: "CONTACTED", label: "Contacted", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { value: "REPLIED", label: "Replied", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { value: "NETWORKING", label: "Networking", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  { value: "INTERVIEW", label: "Interview", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  { value: "OPPORTUNITY", label: "Opportunity", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { value: "CLOSED", label: "Closed", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
];

function getStatusBadge(status: string) {
  const option = STATUS_OPTIONS.find((o) => o.value === status);
  return option ?? { label: status, color: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
}

// Helper to format timestamps
function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function CRMDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [analytics, setAnalytics] = useState<CRMAnalytics | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  const [activeView, setActiveView] = useState<"conversations" | "analytics">("conversations");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name">("recent");

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Notes state
  const [privateNotes, setPrivateNotes] = useState("");

  // ─── Fetching Data (useCallbacks) ──────────────────────────────────────────
  const fetchCRMContacts = useCallback(async (pw: string = password, search = searchQuery, filter = statusFilter, sort = sortBy) => {
    setLoadingList(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (filter) query.append("filter", filter);
      query.append("sort", sort);

      const res = await fetch(`/api/admin/crm?${query.toString()}`, {
        headers: { "x-admin-password": pw },
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoadingList(false);
    }
  }, [password, searchQuery, statusFilter, sortBy]);

  const fetchContactDetails = useCallback(async (contactId: string) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/admin/crm?contactId=${contactId}`, {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const details = await res.json();
        setActiveContact(details);
        setPrivateNotes(details.notes || "");
      }
    } catch (err) {
      console.error("Failed to load details:", err);
    } finally {
      setLoadingDetails(false);
    }
  }, [password]);

  const fetchActivityLogs = useCallback(async (pw: string = password) => {
    try {
      const res = await fetch("/api/admin/crm?activity=true", {
        headers: { "x-admin-password": pw },
      });
      if (res.ok) {
        setActivities(await res.json());
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    }
  }, [password]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/crm?analytics=true", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        setAnalytics(await res.json());
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    }
  }, [password]);

  const verifyAuth = useCallback(async (pw: string) => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/crm?analytics=true", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setAuthError("Incorrect password.");
        setAuthed(false);
        localStorage.removeItem("portfolio_crm_pw");
      } else if (res.ok) {
        setAuthed(true);
        localStorage.setItem("portfolio_crm_pw", pw);
        setAnalytics(await res.json());
        fetchCRMContacts(pw);
        fetchActivityLogs(pw);
      }
    } catch {
      setAuthError("Server verification error.");
    } finally {
      setLoadingList(false);
    }
  }, [fetchCRMContacts, fetchActivityLogs]);

  // ─── Effects ──────────────────────────────────────────────────────────────

  // Check LocalStorage password on load
  useEffect(() => {
    const savedPw = localStorage.getItem("portfolio_crm_pw");
    if (savedPw) {
      queueMicrotask(() => {
        setPassword(savedPw);
        verifyAuth(savedPw);
      });
    }
  }, [verifyAuth]);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.conversations]);

  // Handle draft loading
  useEffect(() => {
    if (activeContact) {
      const savedDraft = localStorage.getItem(`crm_draft_${activeContact.id}`);
      queueMicrotask(() => {
        setReplyText(savedDraft || "");
        setPrivateNotes(activeContact.notes || "");
      });
    }
  }, [activeContact]);

  // Trigger search/filtering
  useEffect(() => {
    if (authed) {
      const delayDebounce = setTimeout(() => {
        fetchCRMContacts();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [authed, fetchCRMContacts]);

  const handleRefresh = async () => {
    await fetchCRMContacts();
    if (activeContact) {
      await fetchContactDetails(activeContact.id);
    }
    await fetchAnalytics();
    await fetchActivityLogs();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAuth(password);
  };

  const handleSignOut = () => {
    localStorage.removeItem("portfolio_crm_pw");
    setAuthed(false);
    setPassword("");
    setContacts([]);
    setActiveContact(null);
  };

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleStatusChange = async (status: string) => {
    if (!activeContact) return;
    
    // Optimistic UI Update
    setContacts((prev) =>
      prev.map((c) => (c.id === activeContact.id ? { ...c, status } : c))
    );
    setActiveContact((prev) => (prev ? { ...prev, status } : null));

    try {
      const res = await fetch("/api/admin/crm", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id: activeContact.id, status }),
      });
      if (res.ok) {
        fetchActivityLogs();
        fetchAnalytics();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeContact) return;
    setSavingNotes(true);
    try {
      const res = await fetch("/api/admin/crm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id: activeContact.id, notes: privateNotes }),
      });
      if (res.ok) {
        setActiveContact((prev) => (prev ? { ...prev, notes: privateNotes } : null));
        fetchActivityLogs();
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSaveDraft = () => {
    if (!activeContact) return;
    localStorage.setItem(`crm_draft_${activeContact.id}`, replyText);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleSendReply = async () => {
    if (!activeContact || !replyText.trim()) return;

    // Resolve the active conversation ID
    const activeConv = activeContact.conversations[0];
    if (!activeConv) {
      alert("No active conversation thread found.");
      return;
    }

    setSendingReply(true);

    try {
      const res = await fetch("/api/admin/crm/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          conversationId: activeConv.id,
          content: replyText,
        }),
      });

      if (res.ok) {
        // Clear draft
        localStorage.removeItem(`crm_draft_${activeContact.id}`);
        setReplyText("");
        
        // Reload details & stats
        await fetchContactDetails(activeContact.id);
        await fetchCRMContacts();
        await fetchAnalytics();
        await fetchActivityLogs();
      } else {
        const data = await res.json();
        alert(`Error sending email: ${data.error || "Unknown error."}`);
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
      alert("Failed to send email. Check console log.");
    } finally {
      setSendingReply(false);
    }
  };

  // Textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
    const textarea = replyInputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 250)}px`;
    }
  };

  // ─── LOGIN SCREEN ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#09090f] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Lock size={22} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">Recruiter CRM Login</h1>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Exclusively protected workspace for Suryachalam&apos;s portfolio administration
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="crm-password" className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Secret Access Key
              </label>
              <input
                id="crm-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#0e0e16] border border-[#1e1e2d] text-slate-200 placeholder-slate-800 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/5 transition-all"
                required
              />
              {authError && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle size={12}/>{authError}</p>}
            </div>
            <button
              type="submit"
              disabled={loadingList}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/15"
            >
              {loadingList ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Unlock Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD RENDERING ────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[#07070a] text-slate-200 flex flex-col font-sans select-none">
      {/* ─── Global Top Navigation Bar ────────────────────────────────────────── */}
      <header className="h-14 shrink-0 bg-[#09090d]/90 backdrop-blur border-b border-[#161623] px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles size={14} className="text-indigo-400" />
            </div>
            <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Recruiter CRM
            </span>
          </div>

          {/* Tab switches */}
          <div className="flex items-center gap-1 bg-[#10101a] border border-[#1e1e2f] p-0.5 rounded-lg">
            <button
              onClick={() => setActiveView("conversations")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                activeView === "conversations"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Inbox size={12} />
              Conversations
            </button>
            <button
              onClick={() => {
                setActiveView("analytics");
                fetchAnalytics();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                activeView === "analytics"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BarChart2 size={12} />
              Analytics
            </button>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loadingList || loadingDetails}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#12121e]/50 text-xs border border-[#161623] transition-colors"
          >
            <RefreshCw size={12} className={loadingList || loadingDetails ? "animate-spin" : ""} />
            Sync
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 text-xs transition-colors"
          >
            <LogOut size={12} />
            Exit CRM
          </button>
        </div>
      </header>

      {/* ─── Main Content Layout ───────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {activeView === "conversations" ? (
          <>
            {/* ─── LEFT SIDEBAR: Inbox List ───────────────────────────────────── */}
            <aside className="w-80 border-r border-[#161623] bg-[#09090d]/30 flex flex-col overflow-hidden">
              {/* Search & Sort Panel */}
              <div className="p-4 border-b border-[#161623] space-y-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0e0e15] border border-[#171725] text-slate-300 placeholder-slate-700 text-xs focus:outline-none focus:border-indigo-500/30"
                  />
                </div>
                <div className="flex items-center gap-2 justify-between">
                  {/* Status filter selection */}
                  <div className="flex items-center gap-1">
                    <ListFilter size={11} className="text-slate-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent text-slate-400 text-xs font-semibold cursor-pointer focus:outline-none"
                    >
                      <option value="ALL">All Statuses</option>
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} className="bg-[#09090d]">
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort selection */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-slate-400 text-xs font-semibold cursor-pointer focus:outline-none"
                  >
                    <option value="recent">Recent</option>
                    <option value="oldest">Oldest</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              {/* Inbox Cards List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#13131e]/50">
                {loadingList && contacts.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <div className="w-5 h-5 mx-auto border-2 border-slate-700 border-t-indigo-400 rounded-full animate-spin" />
                    <p className="text-slate-500 text-xs">Loading inbox...</p>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="p-8 text-center text-slate-600 text-xs">No contacts match the filters.</div>
                ) : (
                  contacts.map((c) => {
                    const badge = getStatusBadge(c.status);
                    const lastConv = c.conversations[0];
                    const lastMsg = lastConv?.messages[0];

                    return (
                      <div
                        key={c.id}
                        onClick={() => fetchContactDetails(c.id)}
                        className={`p-4 cursor-pointer text-left transition-all hover:bg-[#0e0e16]/60 ${
                          activeContact?.id === c.id ? "bg-[#0f0f18] border-l-2 border-indigo-500" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-slate-200 truncate max-w-[130px]">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">
                            {lastConv ? formatTimeAgo(lastConv.lastMessageAt) : ""}
                          </span>
                        </div>
                        
                        {/* Company / Role */}
                        {(c.company || c.role) && (
                          <div className="text-[10px] text-slate-400 truncate mb-2 font-medium">
                            {c.role ? `${c.role} ` : ""}
                            {c.company ? `@ ${c.company}` : ""}
                          </div>
                        )}

                        {/* Subject Snippet */}
                        <div className="text-xs text-slate-300 font-semibold truncate mb-1">
                          {lastConv?.subject || "No active thread"}
                        </div>

                        {/* Message Snippet */}
                        {lastMsg && (
                          <div className="text-[11px] text-slate-500 truncate mb-3 italic">
                            {lastMsg.senderType === "SURYA" ? "Surya: " : ""}
                            {lastMsg.content}
                          </div>
                        )}

                        {/* Status Badge & Unread Dot */}
                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${badge.color}`}>
                            {badge.label}
                          </span>
                          {c.status === "NEW" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            {/* ─── CENTER PANEL: Conversation Timeline ───────────────────────── */}
            <main className="flex-1 flex flex-col bg-[#08080c] relative overflow-hidden">
              {loadingDetails ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-slate-700 border-t-indigo-400 rounded-full animate-spin" />
                  <p className="text-slate-500 text-xs">Loading thread history...</p>
                </div>
              ) : !activeContact ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center">
                    <Inbox size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-300 text-sm">No Conversation Selected</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-xs leading-relaxed">
                      Select a recruiter card from the left inbox to view communication history, send replies, or change status.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Thread Header */}
                  <header className="h-14 shrink-0 px-6 border-b border-[#161623] bg-[#08080c]/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h2 className="font-bold text-sm text-slate-200">{activeContact.name}</h2>
                        <p className="text-[10px] text-slate-500">
                          {activeContact.email}
                          {activeContact.company ? ` · Recruiter at ${activeContact.company}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Status Dropdown selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status:</span>
                      <select
                        value={activeContact.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="bg-[#0e0e15] border border-[#171725] rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:outline-none focus:border-indigo-500/50 text-slate-200"
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </header>

                  {/* Conversation Message List */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Render standard messages */}
                    {activeContact.conversations.map((conv) => (
                      <div key={conv.id} className="space-y-4">
                        {/* Conversation Subject Title Divider */}
                        <div className="flex items-center gap-3 my-4">
                          <div className="h-px flex-1 bg-[#161623]" />
                          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-600 bg-[#08080c] px-3">
                            Thread: {conv.subject}
                          </span>
                          <div className="h-px flex-1 bg-[#161623]" />
                        </div>

                        {conv.messages.map((m) => {
                          const isSurya = m.senderType === "SURYA";
                          return (
                            <div
                              key={m.id}
                              className={`flex ${isSurya ? "justify-end" : "justify-start"} group`}
                            >
                              <div className="max-w-[80%] space-y-1 text-left">
                                {/* Message bubble */}
                                <div
                                  className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap select-text ${
                                    isSurya
                                      ? "bg-[#18182b] text-indigo-200 rounded-tr-none border border-indigo-500/20"
                                      : "bg-[#101017] text-slate-300 rounded-tl-none border border-[#171727]"
                                  }`}
                                >
                                  {m.content}
                                </div>
                                {/* Timestamp & sender label */}
                                <div
                                  className={`flex items-center gap-1.5 text-[9px] text-slate-500 px-1 ${
                                    isSurya ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  <span>{isSurya ? "Surya" : activeContact.name}</span>
                                  <span>·</span>
                                  <span>{new Date(m.createdAt).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>

                  {/* Reply Box Footer */}
                  <footer className="p-4 border-t border-[#161623] bg-[#09090d]/20 space-y-3">
                    <div className="bg-[#0b0b11] border border-[#171727] rounded-xl p-3 flex flex-col focus-within:border-indigo-500/30 transition-colors">
                      <textarea
                        ref={replyInputRef}
                        rows={3}
                        placeholder={`Reply to ${activeContact.name}...`}
                        value={replyText}
                        onChange={handleTextareaChange}
                        className="bg-transparent text-slate-200 placeholder-slate-700 text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto w-full min-h-[50px] max-h-[250px]"
                      />
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#131320]/60">
                        {/* Draft & Status Indicators */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveDraft}
                            disabled={!replyText.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#12121e] text-xs border border-[#161623] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Save response as a local draft"
                          >
                            <Save size={12} />
                            Save Draft
                          </button>
                          {draftSaved && (
                            <span className="text-[10px] text-indigo-400 font-medium animate-pulse">Draft Saved!</span>
                          )}
                        </div>

                        {/* Send Reply Actions */}
                        <button
                          onClick={handleSendReply}
                          disabled={sendingReply || !replyText.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/40 disabled:cursor-not-allowed text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/10"
                        >
                          {sendingReply ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                              Sending Email...
                            </>
                          ) : (
                            <>
                              <Send size={12} />
                              Send Reply
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </footer>
                </>
              )}
            </main>

            {/* ─── RIGHT PANEL: Recruiter Profile & Timeline Notes ────────────── */}
            <aside className="w-72 border-l border-[#161623] bg-[#09090d]/30 flex flex-col overflow-y-auto p-5 space-y-6">
              {activeContact ? (
                <>
                  {/* Contact Summary card */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Candidate Profile</h3>
                    <div className="card-bg rounded-xl border border-[#171727] p-4 space-y-3.5 text-left text-xs">
                      <div className="flex items-start gap-3">
                        <User size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-200">{activeContact.name}</p>
                          <p className="text-[10px] text-slate-500">{activeContact.email}</p>
                        </div>
                      </div>

                      {activeContact.company && (
                        <div className="flex items-start gap-3">
                          <Briefcase size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-300">{activeContact.company}</p>
                            {activeContact.role && <p className="text-[10px] text-slate-500">{activeContact.role}</p>}
                          </div>
                        </div>
                      )}

                      {activeContact.linkedin && (
                        <a
                          href={activeContact.linkedin.startsWith("http") ? activeContact.linkedin : `https://${activeContact.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg bg-[#0c0c14] border border-[#171725] text-indigo-400 hover:text-indigo-300 transition-colors w-full"
                        >
                          <Linkedin size={13} className="shrink-0" />
                          <span className="truncate">View LinkedIn Profile</span>
                        </a>
                      )}

                      <div className="pt-3 border-t border-[#131320] flex items-center justify-between text-[10px] text-slate-500">
                        <span>Lead Source:</span>
                        <span className="font-mono bg-[#0c0c14] border border-[#171725] px-1.5 py-0.5 rounded text-indigo-400">
                          {activeContact.source || "PORTAL"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recruiter Notes */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-left">Private CRM Notes</h3>
                    <div className="space-y-2">
                      <textarea
                        rows={5}
                        placeholder="Add recruiter details, Microsoft hiring timelines, follow-up dates, etc. (Not emailed to recruiter)"
                        value={privateNotes}
                        onChange={(e) => setPrivateNotes(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#09090e] border border-[#171727] text-slate-300 placeholder-slate-700 text-xs leading-relaxed focus:outline-none focus:border-indigo-500/30 resize-none"
                      />
                      <button
                        onClick={handleSaveNotes}
                        disabled={savingNotes || privateNotes === activeContact.notes}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 disabled:opacity-30 disabled:cursor-not-allowed border border-indigo-500/20 text-indigo-400 text-xs font-semibold transition-all"
                      >
                        {savingNotes ? (
                          <>
                            <span className="w-3 h-3 border border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin shrink-0" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FileText size={12} />
                            Save Private Notes
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Interaction Timeline Feed */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-left">Activity History</h3>
                    <div className="space-y-4 border-l border-[#161623] ml-2.5 text-left text-xs">
                      {activeContact.activityLogs && activeContact.activityLogs.length > 0 ? (
                        activeContact.activityLogs.map((log) => {
                          let label = log.action;
                          try {
                            const meta = JSON.parse(log.metadata || "{}");
                            if (log.action === "Status Changed") {
                              label = `Status transitioned to ${meta.newStatus}`;
                            }
                          } catch { /* use default label */ }

                          return (
                            <div key={log.id} className="relative pl-6 pb-1">
                              {/* Dot marker */}
                              <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-[#08080c] shadow-[0_0_0_2px_rgba(99,102,241,0.1)] group-hover:bg-indigo-500" />
                              
                              <p className="font-semibold text-slate-300 leading-snug">{label}</p>
                              <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock size={9} />
                                {new Date(log.createdAt).toLocaleString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-slate-600 text-xs pl-4">No logged history yet.</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-600 text-xs py-10">No profile selected.</div>
              )}
            </aside>
          </>
        ) : (
          /* ─── TAB VIEW: Recruiter Analytics & Global Timeline ────────────────── */
          <main className="flex-1 overflow-y-auto p-8 space-y-10 bg-[#08080c] select-text">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">CRM Analytics Dashboard</h1>
              <p className="text-slate-500 text-xs mt-1">
                Real-time funnel conversion metrics, average response statistics, and global event logs
              </p>
            </div>

            {analytics ? (
              <>
                {/* Stats row */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card-bg rounded-xl border border-[#161623] p-5">
                    <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1.5">Total Contacts</p>
                    <p className="text-3xl font-extrabold text-slate-100 mb-0.5">{analytics.totalContacts}</p>
                    <p className="text-[10px] text-slate-400">Recruiters stored in DB</p>
                  </div>
                  <div className="card-bg rounded-xl border border-[#161623] p-5">
                    <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1.5">Active Pipelines</p>
                    <p className="text-3xl font-extrabold text-indigo-400 mb-0.5">{analytics.activeConversations}</p>
                    <p className="text-[10px] text-slate-400">Status is not Closed/New</p>
                  </div>
                  <div className="card-bg rounded-xl border border-[#161623] p-5">
                    <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1.5">Reponse Rate</p>
                    <p className="text-3xl font-extrabold text-emerald-400 mb-0.5">{analytics.responseRate}%</p>
                    <p className="text-[10px] text-slate-400">Conversations with Surya reply</p>
                  </div>
                  <div className="card-bg rounded-xl border border-[#161623] p-5">
                    <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1.5">Avg Response Time</p>
                    <p className="text-3xl font-extrabold text-amber-400 mb-0.5">{analytics.avgResponseTimeStr}</p>
                    <p className="text-[10px] text-slate-400">Duration until first reply</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  {/* Recruiter Funnel Chart (Premium SVG) */}
                  <div className="lg:col-span-6 card-bg rounded-xl border border-[#161623] p-6 space-y-6">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Recruiter Pipeline Funnel</h3>
                      <p className="text-[10px] text-slate-500">Pipeline progression of all leads submitted through the portal</p>
                    </div>

                    <div className="relative pt-2">
                      {/* Funnel visualizer */}
                      <div className="space-y-3 text-left">
                        {[
                          { key: "NEW", label: "New Leads", count: analytics.funnelStages.NEW, color: "bg-blue-500" },
                          { key: "CONTACTED", label: "Contacted", count: analytics.funnelStages.CONTACTED, color: "bg-purple-500" },
                          { key: "REPLIED", label: "Replied", count: analytics.funnelStages.REPLIED, color: "bg-emerald-500" },
                          { key: "NETWORKING", label: "Networking", count: analytics.funnelStages.NETWORKING, color: "bg-pink-500" },
                          { key: "INTERVIEW", label: "Interview Leads", count: analytics.funnelStages.INTERVIEW, color: "bg-orange-500" },
                          { key: "OPPORTUNITY", label: "Opportunities", count: analytics.funnelStages.OPPORTUNITY, color: "bg-amber-500" },
                          { key: "CLOSED", label: "Closed", count: analytics.funnelStages.CLOSED, color: "bg-slate-500" },
                        ].map((stage) => {
                          const maxCount = Math.max(...Object.values(analytics.funnelStages), 1);
                          const percentage = Math.round((stage.count / maxCount) * 100);
                          return (
                            <div key={stage.key} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-300">{stage.label}</span>
                                <span className="font-mono text-slate-400 font-bold">{stage.count}</span>
                              </div>
                              <div className="h-6 rounded-lg bg-[#0c0c14] border border-[#171725] overflow-hidden flex items-center px-1">
                                <div
                                  className={`h-4 rounded-md transition-all duration-500 flex items-center justify-end px-2 ${stage.color}`}
                                  style={{ width: `${Math.max(percentage, 8)}%` }}
                                >
                                  {percentage > 15 && (
                                    <span className="text-[8px] font-extrabold text-black font-mono">
                                      {percentage}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Global Activities Timeline Feed */}
                  <div className="lg:col-span-6 card-bg rounded-xl border border-[#161623] p-6 space-y-6">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Global Activity Feed</h3>
                      <p className="text-[10px] text-slate-500">Chronological history of CRM actions across all candidate leads</p>
                    </div>

                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 divide-y divide-[#131320]/50 text-left">
                      {activities.map((log) => {
                        let label = log.action;
                        try {
                          const meta = JSON.parse(log.metadata || "{}");
                          if (log.action === "Contact Created") {
                            label = `New lead created for ${meta.contactName || "Recruiter"}`;
                          } else if (log.action === "Status Changed") {
                            label = `Lead status for ID ${meta.contactId.slice(-4)} updated to ${meta.newStatus}`;
                          } else if (log.action === "Email Sent") {
                            label = `Outbound email dispatched to ID ${meta.contactId.slice(-4)}`;
                          } else if (log.action === "Reply Received") {
                            label = `Inbound response synced from ID ${meta.contactId.slice(-4)}`;
                          }
                        } catch { /* ignored */ }

                        return (
                          <div key={log.id} className="pt-3.5 first:pt-0">
                            <div className="flex items-start gap-3 justify-between">
                              <span className="text-xs font-semibold text-slate-300 leading-snug">{label}</span>
                              <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                                {new Date(log.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {activities.length === 0 && (
                        <p className="text-slate-600 text-xs text-center py-10">No activities logged yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 py-10 text-xs">Loading analytics data...</div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
