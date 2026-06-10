"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Briefcase,
  Trophy,
  FileCheck2,
  Calendar,
  Compass,
  Target,
  Users,
  FileText,
  Bell,
  Activity,
  BarChart3,
  Search,
  Plus,
  Menu,
  Moon,
  Sun,
  Laptop,
  CheckCircle,
  Inbox,
  Send,
  Save,
  Trash2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Link,
  Sliders,
  AlertCircle,
  ListTodo,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
} from "lucide-react";
import {
  verifyPasswordAction,
  getDashboardData,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  createApplication,
  updateApplication,
  deleteApplication,
  createEvent,
  updateEvent,
  deleteEvent,
  createLearningRoadmap,
  updateLearningRoadmap,
  deleteLearningRoadmap,
  createGoal,
  updateGoal,
  deleteGoal,
  createContact,
  updateContact,
  deleteContact,
  createNote,
  updateNote,
  deleteNote,
  createReminder,
  updateReminder,
  toggleReminderCompleted,
  deleteReminder,
  globalSearchAction,
  markAlertReadAction,
  dismissAlertAction,
  runAuditAction,
} from "@/app/actions/careeros";

// ─── Query Client Instantiation ──────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function AdminPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <CareerOSAdmin />
    </QueryClientProvider>
  );
}

// ─── Constants ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "crm", label: "Recruiter CRM", icon: Inbox },
  { id: "opportunities", label: "Opportunities", icon: Briefcase },
  { id: "hackathons", label: "Hackathons", icon: Trophy },
  { id: "applications", label: "Applications", icon: FileCheck2 },
  { id: "events", label: "Events", icon: Calendar },
  { id: "roadmap", label: "Roadmap", icon: Compass },
  { id: "goals", label: "Goals", icon: Target },
  { id: "networking", label: "Networking", icon: Users },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "timeline", label: "Timeline", icon: Activity },
];

const OPPORTUNITY_TYPES = ["INTERNSHIP", "JOB", "FREELANCE", "OPEN_SOURCE", "STARTUP", "COLLABORATION"];
const OPPORTUNITY_STATUSES = ["DISCOVERED", "RESEARCHING", "APPLIED", "IN_PROGRESS", "INTERVIEW", "OFFER", "REJECTED", "CLOSED"];
const HACKATHON_STATUSES = ["RESEARCHING", "PLANNING", "REGISTERED", "SUBMITTED", "COMPLETED", "FINALIST", "WON"];
const APPLICATION_STATUSES = ["SAVED", "APPLIED", "OA", "INTERVIEW", "FINAL_ROUND", "OFFER", "REJECTED"];
const GOAL_CATEGORIES = ["ANNUAL", "QUARTERLY", "MONTHLY", "WEEKLY"];
const GOAL_STATUSES = ["NOT_STARTED", "ACTIVE", "COMPLETED", "ARCHIVED"];

// ─── Primary Dashboard Component ──────────────────────────────────────────────
function CareerOSAdmin() {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setCurrentTime(Date.now()), 0);
    return () => clearTimeout(timer);
  }, []);

  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("analytics");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Command palette and search states
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");
  const [globalSearchResults, setGlobalSearchResults] = useState<any>(null);
  const [globalSearchLoading, setGlobalSearchLoading] = useState(false);

  // Active Creation Modals
  const [activeModal, setActiveModal] = useState<string | null>(null); // "opportunity" | "hackathon" | "application" | "event" | "roadmap" | "goal" | "contact" | "note" | "reminder"
  const [modalEditItem, setModalEditItem] = useState<any>(null); // Item being edited (if any)

  const queryClient = useQueryClient();
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);

  const verifyPassword = async (pw: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await verifyPasswordAction(pw);
      if (res.success) {
        setAuthed(true);
        localStorage.setItem("careeros_pw", pw);
      } else {
        setAuthError(res.error || "Invalid Access Key");
        localStorage.removeItem("careeros_pw");
      }
    } catch {
      setAuthError("Server verification error");
    } finally {
      setAuthLoading(false);
    }
  };

  // Load password from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("careeros_pw");
    if (saved) {
      setTimeout(() => {
        setPassword(saved);
        verifyPassword(saved);
      }, 0);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPassword(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("careeros_pw");
    setAuthed(false);
    setPassword("");
  };

  // React Query Fetching
  const { data: store, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ["dashboardData", password],
    queryFn: () => getDashboardData(password),
    enabled: authed,
  });

  const handleMarkAlertRead = async (id: string) => {
    try {
      await markAlertReadAction(password, id);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (err: any) {
      alert(`Failed to mark read: ${err.message}`);
    }
  };

  const handleDismissAlert = async (id: string) => {
    try {
      await dismissAlertAction(password, id);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (err: any) {
      alert(`Failed to dismiss alert: ${err.message}`);
    }
  };

  const unreadAlertsCount = useMemo(() => {
    if (!store || !store.dashboardAlerts) return 0;
    return store.dashboardAlerts.filter((a: any) => !a.read).length;
  }, [store]);

  // Global search trigger
  useEffect(() => {
    if (!globalQuery.trim() || !authed) {
      const timer = setTimeout(() => setGlobalSearchResults(null), 0);
      return () => clearTimeout(timer);
    }
    const delay = setTimeout(async () => {
      setGlobalSearchLoading(true);
      try {
        const res = await globalSearchAction(password, globalQuery);
        setGlobalSearchResults(res);
      } catch (e) {
        console.error("Global search failed:", e);
      } finally {
        setGlobalSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [globalQuery, password, authed]);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        setActiveModal(null);
        setModalEditItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Generic Mutation helper
  const executeMutation = async (actionFn: any, successMessage?: string) => {
    try {
      await actionFn();
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      setActiveModal(null);
      setModalEditItem(null);
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  // UI styling references based on mode
  const theme = useMemo(() => {
    if (isDarkMode) {
      return {
        bg: "bg-[#09090b] text-zinc-100",
        sidebar: "bg-[#0e0e11] border-zinc-800",
        card: "bg-[#0e0e11] border-zinc-800 shadow-[2px_2px_0px_0px_#18181b]",
        input: "bg-[#16161c] border-zinc-800 text-zinc-100 placeholder-zinc-600",
        border: "border-zinc-800",
        accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        red: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        orange: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        hover: "hover:bg-zinc-900/60",
        selected: "bg-indigo-950/40 text-indigo-400 border-indigo-500/30 shadow-[1px_1px_0px_0px_#4f46e5]",
        textMuted: "text-zinc-550",
        nestedBg: "bg-zinc-900/40",
        nestedCard: "bg-[#0e0e11] border border-zinc-800 shadow-[1px_1px_0px_0px_#18181b]",
      };
    } else {
      return {
        bg: "bg-[#f4f4f5] text-zinc-950",
        sidebar: "bg-white border-zinc-900",
        card: "bg-white border-zinc-900 shadow-[3px_3px_0px_0px_#09090b]",
        input: "bg-zinc-50 border-zinc-900 text-zinc-955 placeholder-zinc-400",
        border: "border-zinc-900",
        accent: "text-indigo-600 bg-indigo-50 border-indigo-900/20",
        green: "text-emerald-600 bg-emerald-50 border-emerald-900/20",
        red: "text-rose-600 bg-rose-50 border-rose-900/20",
        orange: "text-amber-600 bg-amber-50 border-amber-900/20",
        hover: "hover:bg-zinc-100",
        selected: "bg-indigo-50 text-indigo-700 border-indigo-900 shadow-[2px_2px_0px_0px_#09090b]",
        textMuted: "text-zinc-400",
        nestedBg: "bg-zinc-200/50",
        nestedCard: "bg-white border border-zinc-900 shadow-[2px_2px_0px_0px_#09090b]",
      };
    }
  }, [isDarkMode]);

  // Auth Screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center px-6 selection:bg-indigo-500/20">
        <div className="w-full max-w-sm p-8 bg-[#0b0b0f] border border-[#161623] rounded-2xl shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center">
              <Sparkles size={20} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-zinc-100">CareerOS Console</h1>
            <p className="text-xs text-zinc-500 font-mono">Restricted access portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                Secret Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-[#161623] text-zinc-100 placeholder-zinc-800 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-mono"
                required
              />
              {authError && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-mono">
                  <AlertCircle size={12} /> {authError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Authenticate"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Loader/Error Screen
  if (storeLoading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex flex-col gap-4 items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 font-mono animate-pulse">Initializing Personal Career OS...</p>
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="min-h-screen bg-[#07070a] flex flex-col gap-4 items-center justify-center p-6 text-center">
        <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-200">Failed to Load Dashboard Database</h2>
          <p className="text-xs text-zinc-500 font-mono max-w-sm">
            Check logs. Make sure database file is valid and Prisma generated models match.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-xl font-bold uppercase transition-all"
        >
          Reset Session
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex font-sans ${theme.bg} selection:bg-indigo-500/25 relative overflow-hidden transition-colors duration-200`}>
      {/* Mobile Sidebar drawer backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-[#07070a]/40 backdrop-blur-sm z-10 md:hidden"
        />
      )}

      {/* ─── SIDE NAVIGATION BAR ────────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 w-64 border-r ${theme.sidebar} flex flex-col shrink-0 z-20 backdrop-blur-md transition-transform duration-300 md:relative md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* App Logo & Details */}
        <div className="p-6 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <Sparkles size={16} className="text-indigo-400" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CareerOS
              </span>
              <p className="text-[9px] text-zinc-500 font-mono">v1.2.0-beta</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Database Connected" />
          </div>
        </div>

        {/* Navigation Tab Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent ${
                  isSelected ? theme.selected : `text-zinc-400 hover:text-zinc-200 ${theme.hover}`
                }`}
              >
                <Icon size={14} className={isSelected ? "text-indigo-400" : "text-zinc-500"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Sidebar Footer Controls */}
        <div className="p-4 border-t border-inherit space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300">
                S
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-200">Suryachalam</p>
                <p className="text-[10px] text-zinc-500 font-mono">Developer</p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border ${theme.border} text-zinc-400 hover:text-zinc-100 ${theme.hover} transition-all`}
            >
              {isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-bold text-xs tracking-wide uppercase transition-all"
          >
            Logout OS
          </button>
        </div>
      </aside>

      {/* ─── CENTRAL WORKSPACE CANVAS ───────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {/* Global Toolbar Header */}
        <header className={`h-16 shrink-0 border-b ${theme.border} px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 bg-inherit/90 backdrop-blur-md`}>
          <div className="flex items-center gap-3 w-full md:w-96 relative">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-lg hover:bg-zinc-800/20 text-zinc-405 flex items-center justify-center border border-transparent shrink-0"
              title="Open Sidebar"
            >
              <Menu size={16} />
            </button>
            <div className="relative flex-1 flex items-center">
              <Search size={14} className="text-zinc-500 absolute left-3" />
              <input
                type="text"
                placeholder="Search OS... (Ctrl+K)"
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:border-indigo-500/50 transition-all ${theme.input}`}
              />
            </div>
            {/* Global Search Popup Dropdown */}
            {globalQuery.trim() && (
              <div className={`absolute top-12 left-0 w-full rounded-xl border ${theme.card} shadow-xl p-4 space-y-4 max-h-96 overflow-y-auto z-50 bg-[#0b0b0f]`}>
                <div className="flex justify-between items-center border-b border-[#161623] pb-2">
                  <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest">
                    Search Results
                  </span>
                  {globalSearchLoading && (
                    <span className="w-3 h-3 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
                  )}
                </div>
                {globalSearchResults && Object.values(globalSearchResults).every((arr: any) => arr.length === 0) ? (
                  <p className="text-xs text-zinc-500 font-mono py-4 text-center">No matching records found.</p>
                ) : (
                  <div className="space-y-4">
                    {globalSearchResults &&
                      Object.entries(globalSearchResults).map(([key, items]: any) => {
                        if (items.length === 0) return null;
                        return (
                          <div key={key} className="space-y-1.5">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
                              {key}
                            </span>
                            <div className="space-y-1">
                              {items.map((item: any) => (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setActiveTab(key === "contacts" ? "crm" : key);
                                    setGlobalQuery("");
                                  }}
                                  className={`w-full text-left p-2 rounded-lg text-xs font-semibold hover:bg-zinc-800/40 border border-transparent transition-all flex items-center justify-between`}
                                >
                                  <span className="truncate max-w-[250px]">{item.title || item.name || item.topic}</span>
                                  <span className="text-[10px] text-zinc-500 font-mono capitalize">
                                    {item.company || item.status || "view"} →
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Modals launching panel */}
            <div className="flex items-center gap-1.5 bg-[#10101a] border border-[#1e1e2f] p-0.5 rounded-xl">
              <button
                onClick={() => {
                  setCommandPaletteOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 text-[10px] font-bold uppercase transition-all"
              >
                <Sliders size={12} />
                Actions
              </button>
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAlertsDropdownOpen(!alertsDropdownOpen)}
                className={`p-2.5 rounded-xl border ${theme.border} text-zinc-400 hover:text-zinc-150 hover:bg-zinc-800/35 transition-all relative flex items-center justify-center`}
                title="System alerts"
              >
                <Bell size={13} />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white font-mono scale-90 animate-pulse">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>

              {alertsDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-2xl border ${theme.card} shadow-2xl p-4 space-y-3 z-50 bg-[#0b0b0f] backdrop-blur-xl bg-opacity-95`}>
                  <div className="flex justify-between items-center border-b border-[#161623] pb-2">
                    <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest">
                      Alert Center
                    </span>
                    {unreadAlertsCount > 0 && (
                      <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                        {unreadAlertsCount} New
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto scrollbar-none">
                    {!store.dashboardAlerts || store.dashboardAlerts.length === 0 ? (
                      <p className="text-[10px] text-zinc-650 font-mono py-6 text-center">No active alerts.</p>
                    ) : (
                      store.dashboardAlerts.map((alert: any) => {
                        const urgencyColors = alert.urgency === "CRITICAL"
                          ? "border-rose-500/20 bg-rose-500/5 text-rose-300"
                          : alert.urgency === "HIGH"
                          ? "border-amber-500/20 bg-amber-500/5 text-amber-300"
                          : alert.urgency === "MEDIUM"
                          ? "border-indigo-500/20 bg-indigo-500/5 text-indigo-300"
                          : "border-zinc-800 bg-zinc-900/10 text-zinc-400";
                        return (
                          <div
                            key={alert.id}
                            className={`p-3 rounded-xl border ${urgencyColors} space-y-1 text-left relative group ${
                              !alert.read ? "ring-1 ring-indigo-500/30" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-[11px] font-bold leading-tight">
                                {alert.title}
                              </h4>
                              <span className="text-[8px] font-bold uppercase tracking-widest px-1 py-0.5 rounded bg-zinc-850 text-zinc-400 shrink-0 font-mono scale-90">
                                {alert.urgency}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal">
                              {alert.message}
                            </p>
                            <div className="flex justify-between items-center pt-1.5 border-t border-[#131320]/40 text-[9px] font-mono mt-1">
                              <span className="text-zinc-500">
                                {new Date(alert.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex gap-2">
                                {!alert.read && (
                                  <button
                                    onClick={() => handleMarkAlertRead(alert.id)}
                                    className="text-indigo-400 hover:text-indigo-300 font-bold"
                                  >
                                    Mark Read
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDismissAlert(alert.id)}
                                  className="text-zinc-500 hover:text-zinc-300 font-bold"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveModal("reminder")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide uppercase transition-all"
              >
                <Plus size={12} />
                Schedule Reminder
              </button>
            </div>
          </div>
        </header>

        {/* Core Canvas Body Renderer */}
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto flex-1">
          {/* TAB 1: ANALYTICS MODULE */}
          {activeTab === "analytics" && (
            <AnalyticsView store={store} theme={theme} setActiveTab={setActiveTab} password={password} />
          )}

          {/* TAB 2: CRM MODULE */}
          {activeTab === "crm" && (
            <CRMView
              store={store}
              theme={theme}
              password={password}
              onEditContact={(item) => {
                setModalEditItem(item);
                setActiveModal("contact");
              }}
            />
          )}

          {/* TAB 3: OPPORTUNITIES MODULE */}
          {activeTab === "opportunities" && (
            <OpportunitiesView
              store={store}
              theme={theme}
              password={password}
              onAddOpportunity={() => {
                setModalEditItem(null);
                setActiveModal("opportunity");
              }}
              onEditOpportunity={(item) => {
                setModalEditItem(item);
                setActiveModal("opportunity");
              }}
              onDeleteOpportunity={(id) => {
                if (confirm("Delete opportunity?")) {
                  executeMutation(() => deleteOpportunity(password, id));
                }
              }}
            />
          )}

          {/* TAB 4: HACKATHONS MODULE */}
          {activeTab === "hackathons" && (
            <HackathonsView
              store={store}
              theme={theme}
              password={password}
              onAddHackathon={() => {
                setModalEditItem(null);
                setActiveModal("hackathon");
              }}
              onEditHackathon={(item) => {
                setModalEditItem(item);
                setActiveModal("hackathon");
              }}
              onDeleteHackathon={(id) => {
                if (confirm("Delete hackathon record?")) {
                  executeMutation(() => deleteHackathon(password, id));
                }
              }}
            />
          )}

          {/* TAB 5: APPLICATIONS MODULE */}
          {activeTab === "applications" && (
            <ApplicationsView
              store={store}
              theme={theme}
              password={password}
              onAddApplication={() => {
                setModalEditItem(null);
                setActiveModal("application");
              }}
              onEditApplication={(item) => {
                setModalEditItem(item);
                setActiveModal("application");
              }}
              onDeleteApplication={(id) => {
                if (confirm("Delete job application tracker?")) {
                  executeMutation(() => deleteApplication(password, id));
                }
              }}
            />
          )}

          {/* TAB 6: EVENTS MODULE */}
          {activeTab === "events" && (
            <EventsView
              store={store}
              theme={theme}
              password={password}
              onAddEvent={() => {
                setModalEditItem(null);
                setActiveModal("event");
              }}
              onEditEvent={(item) => {
                setModalEditItem(item);
                setActiveModal("event");
              }}
              onDeleteEvent={(id) => {
                if (confirm("Delete event?")) {
                  executeMutation(() => deleteEvent(password, id));
                }
              }}
            />
          )}

          {/* TAB 7: ROADMAP MODULE */}
          {activeTab === "roadmap" && (
            <RoadmapView
              store={store}
              theme={theme}
              password={password}
              onAddRoadmap={() => {
                setModalEditItem(null);
                setActiveModal("roadmap");
              }}
              onEditRoadmap={(item) => {
                setModalEditItem(item);
                setActiveModal("roadmap");
              }}
              onDeleteRoadmap={(id) => {
                if (confirm("Delete roadmap topic?")) {
                  executeMutation(() => deleteLearningRoadmap(password, id));
                }
              }}
            />
          )}

          {/* TAB 8: GOALS MODULE */}
          {activeTab === "goals" && (
            <GoalsView
              store={store}
              theme={theme}
              password={password}
              onAddGoal={() => {
                setModalEditItem(null);
                setActiveModal("goal");
              }}
              onEditGoal={(item) => {
                setModalEditItem(item);
                setActiveModal("goal");
              }}
              onDeleteGoal={(id) => {
                if (confirm("Delete goal?")) {
                  executeMutation(() => deleteGoal(password, id));
                }
              }}
            />
          )}

          {/* TAB 9: NETWORKING TRACKER */}
          {activeTab === "networking" && (
            <NetworkingView
              store={store}
              theme={theme}
              password={password}
              onAddContact={() => {
                setModalEditItem(null);
                setActiveModal("contact");
              }}
              onEditContact={(item) => {
                setModalEditItem(item);
                setActiveModal("contact");
              }}
              onDeleteContact={(id) => {
                if (confirm("Delete networking contact?")) {
                  executeMutation(() => deleteContact(password, id));
                }
              }}
            />
          )}

          {/* TAB 10: NOTES SYSTEM */}
          {activeTab === "notes" && (
            <NotesView
              store={store}
              theme={theme}
              password={password}
              onAddNote={() => {
                setModalEditItem(null);
                setActiveModal("note");
              }}
              onEditNote={(item) => {
                setModalEditItem(item);
                setActiveModal("note");
              }}
              onDeleteNote={(id) => {
                if (confirm("Delete note?")) {
                  executeMutation(() => deleteNote(password, id));
                }
              }}
            />
          )}

          {/* TAB 11: REMINDER ENGINE */}
          {activeTab === "reminders" && (
            <RemindersView
              store={store}
              theme={theme}
              password={password}
              onAddReminder={() => {
                setModalEditItem(null);
                setActiveModal("reminder");
              }}
              onToggleCompleted={async (id, completed) => {
                await toggleReminderCompleted(password, id, completed);
                queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
              }}
              onDeleteReminder={async (id) => {
                if (confirm("Delete reminder?")) {
                  await deleteReminder(password, id);
                  queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
                }
              }}
            />
          )}

          {/* TAB 12: ACTIVITY TIMELINE */}
          {activeTab === "timeline" && (
            <TimelineView store={store} theme={theme} />
          )}
        </div>
      </main>

      {/* ─── GLOBAL COMMAND PALETTE (CTRL+K OVERLAY) ───────────────────────────── */}
      {commandPaletteOpen && (
        <CommandPaletteOverlay
          theme={theme}
          onClose={() => setCommandPaletteOpen(false)}
          onTriggerAction={(actionId) => {
            setCommandPaletteOpen(false);
            if (actionId === "add-opp") setActiveModal("opportunity");
            if (actionId === "add-hack") setActiveModal("hackathon");
            if (actionId === "add-app") setActiveModal("application");
            if (actionId === "add-evt") setActiveModal("event");
            if (actionId === "add-goal") setActiveModal("goal");
            if (actionId === "add-contact") setActiveModal("contact");
            if (actionId === "add-note") setActiveModal("note");
            if (actionId === "add-reminder") setActiveModal("reminder");
          }}
        />
      )}

      {/* ─── MODALS CONFIGURATOR PANEL ──────────────────────────────────────────── */}
      {activeModal && (
        <ModalPanel
          type={activeModal}
          theme={theme}
          password={password}
          item={modalEditItem}
          onClose={() => {
            setActiveModal(null);
            setModalEditItem(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
            setActiveModal(null);
            setModalEditItem(null);
          }}
        />
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS & TAB RENDERING LAYOUTS ──────────────────────────────────

// 1. ANALYTICS MODULE VIEW
function AnalyticsView({ store, theme, setActiveTab, password }: { store: any; theme: any; setActiveTab: (t: string) => void; password: any }) {
  // Compute metric calculations
  const totalOpp = store.opportunities.length;
  const totalApps = store.applications.length;
  const activeRoadmapCount = store.roadmaps.filter((r: any) => r.progress < 100).length;
  const completedGoals = store.goals.filter((g: any) => g.status === "COMPLETED").length;
  const hackathonsWon = store.hackathons.filter((h: any) => h.status === "WON").length;
  const eventsCount = store.events.length;
  const networkCount = store.contacts.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metric Cards Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Opportunities", value: totalOpp, detail: "Central listings", icon: Briefcase, color: theme.accent, tab: "opportunities" },
          { label: "Applications Sent", value: totalApps, detail: "Sent trackings", icon: FileCheck2, color: theme.green, tab: "applications" },
          { label: "Hackathons Won", value: hackathonsWon, detail: "Award recognitions", icon: Trophy, color: theme.orange, tab: "hackathons" },
          { label: "Goal Progress", value: `${completedGoals} Done`, detail: "Checklists success", icon: Target, color: theme.red, tab: "goals" },
        ].map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(c.tab)}
            className={`p-6 rounded-2xl border text-left flex items-start justify-between cursor-pointer group transition-all duration-200 ${theme.card} hover:scale-[1.01] hover:shadow-md`}
          >
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">{c.label}</p>
              <h3 className="text-3xl font-black">{c.value}</h3>
              <p className="text-xs text-zinc-500">{c.detail}</p>
            </div>
            <div className={`p-3 rounded-xl border ${c.color} group-hover:scale-105 transition-all`}>
              <c.icon size={16} />
            </div>
          </button>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visitor Traffic Custom SVG Line Chart */}
        <div className={`lg:col-span-8 p-6 rounded-2xl border ${theme.card} space-y-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold tracking-tight">Active Opportunities Distribution</h3>
              <p className="text-xs text-zinc-500">Breakdown of listings categorised by status</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Active Jobs
              </span>
            </div>
          </div>

          {/* Simple Visual Representation representing distribution metrics */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-[#161623] px-4">
            {OPPORTUNITY_STATUSES.map((status) => {
              const count = store.opportunities.filter((o: any) => o.status === status).length;
              const maxCount = Math.max(...OPPORTUNITY_STATUSES.map(s => store.opportunities.filter((o: any) => o.status === s).length), 1);
              const heightPct = (count / maxCount) * 100;
              return (
                <div key={status} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 rounded-t-lg transition-all relative flex flex-col justify-end" style={{ height: `${Math.max(heightPct, 6)}%` }}>
                    {count > 0 && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono text-zinc-200">
                        {count}
                      </span>
                    )}
                  </div>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider truncate w-full text-center" title={status}>
                    {status.substring(0, 5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini status tracking list sidebar */}
        <div className={`lg:col-span-4 p-6 rounded-2xl border ${theme.card} flex flex-col justify-between`}>
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-tight">Core Career Metrics</h3>
            <div className="space-y-3.5">
              {[
                { label: "Learning Roadmaps", value: activeRoadmapCount, sub: "Ongoing syllabus", icon: Compass, color: "text-indigo-400 bg-indigo-500/10" },
                { label: "Networking Directory", value: networkCount, sub: "Contacts stored", icon: Users, color: "text-emerald-400 bg-emerald-500/10" },
                { label: "Events Planned", value: eventsCount, sub: "Meetups scheduled", icon: Calendar, color: "text-amber-400 bg-amber-500/10" },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-zinc-800/20 rounded-xl border border-[#161623]">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${m.color}`}>
                      <m.icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-200">{m.label}</p>
                      <p className="text-[10px] text-zinc-500">{m.sub}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#161623] pt-4 mt-4 text-center">
            <p className="text-[10px] text-zinc-500 font-mono">
              System Database Status: <span className="text-emerald-400 font-bold uppercase">Ready</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of logs & proactive deadlines watch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadline Watch Widget */}
        <DeadlineWatchWidget store={store} theme={theme} password={password} />

        {/* Recents logs list summary */}
        <div className={`p-6 rounded-2xl border ${theme.card} space-y-4`}>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold tracking-tight">Recent System Logs</h3>
            <button onClick={() => setActiveTab("timeline")} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
              View All Logs →
            </button>
          </div>
          <div className="divide-y divide-[#161623] max-h-[220px] overflow-y-auto scrollbar-none">
            {store.activityLogs.slice(0, 5).map((log: any) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-zinc-300 truncate">{log.action}</span>
                  <span className="text-zinc-500 font-mono text-[10px] truncate hidden md:inline">
                    {log.metadata && JSON.stringify(JSON.parse(log.metadata))}
                  </span>
                </div>
                <span className="text-zinc-500 text-[10px] font-mono shrink-0">
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Urgency Priority & Visual Badges ──────────────────────────────────────────
export function getUrgencyPriority(deadlineStr?: string | null): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  if (!deadlineStr) return "LOW";
  const deadline = new Date(deadlineStr);
  const diffMs = deadline.getTime() - Date.now();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours <= 0) return "CRITICAL";
  if (diffHours < 24) return "CRITICAL";
  if (diffHours < 24 * 3) return "HIGH";
  if (diffHours < 24 * 7) return "MEDIUM";
  return "LOW";
}

export function PriorityBadge({ priority }: { priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" }) {
  const styles = {
    CRITICAL: "bg-rose-500/10 border-rose-500/25 text-rose-400 border",
    HIGH: "bg-orange-500/10 border-orange-500/25 text-orange-400 border",
    MEDIUM: "bg-amber-500/10 border-amber-500/25 text-amber-400 border",
    LOW: "bg-zinc-800 border-zinc-700 text-zinc-400 border",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function DeadlineWatchWidget({ store, theme, password }: { store: any; theme: any; password: any }) {
  const queryClient = useQueryClient();
  const [activeWatchTab, setActiveWatchTab] = useState<"urgent" | "upcoming" | "missed">("urgent");
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(Date.now());
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Collect all items with deadlines
  const allItems = useMemo(() => {
    const list: any[] = [];

    // 1. Opportunities
    store.opportunities.forEach((o: any) => {
      if (o.deadline) {
        list.push({
          id: o.id,
          title: `${o.title} @ ${o.company}`,
          date: new Date(o.deadline),
          type: "Opportunity",
          status: o.status,
          raw: o,
        });
      }
    });

    // 2. Hackathons
    store.hackathons.forEach((h: any) => {
      if (h.deadline) {
        list.push({
          id: h.id,
          title: h.name,
          date: new Date(h.deadline),
          type: "Hackathon",
          status: h.status,
          raw: h,
        });
      }
    });

    // 3. Applications
    store.applications.forEach((a: any) => {
      if (a.nextFollowUp) {
        list.push({
          id: a.id,
          title: `Follow up: ${a.role} @ ${a.company}`,
          date: new Date(a.nextFollowUp),
          type: "Application",
          status: a.status,
          raw: a,
        });
      }
    });

    // 4. Events
    store.events.forEach((e: any) => {
      if (e.startDate) {
        list.push({
          id: e.id,
          title: e.title,
          date: new Date(e.startDate),
          type: "Event",
          status: e.category,
          raw: e,
        });
      }
    });

    // 5. Goals
    store.goals.forEach((g: any) => {
      if (g.targetDate) {
        list.push({
          id: g.id,
          title: g.title,
          date: new Date(g.targetDate),
          type: "Goal",
          status: g.status,
          raw: g,
        });
      }
    });

    // 6. Contacts (CRM)
    store.contacts.forEach((c: any) => {
      if (c.nextFollowUp) {
        list.push({
          id: c.id,
          title: `Connect with ${c.name}`,
          date: new Date(c.nextFollowUp),
          type: "Contact",
          status: c.status,
          raw: c,
        });
      }
    });

    return list.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [store]);

  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Grouping
  const urgentItems = allItems.filter(item => {
    return item.date >= now && item.date <= sevenDaysLater && !["CLOSED", "REJECTED", "OFFER", "COMPLETED", "FINALIST", "WON", "ARCHIVED", "EXPIRED"].includes(item.status);
  });

  const upcomingItems = allItems.filter(item => {
    return item.date > sevenDaysLater && item.date <= thirtyDaysLater && !["CLOSED", "REJECTED", "OFFER", "COMPLETED", "FINALIST", "WON", "ARCHIVED", "EXPIRED"].includes(item.status);
  });

  const missedItems = allItems.filter(item => {
    return (item.date < now && !["CLOSED", "REJECTED", "OFFER", "COMPLETED", "FINALIST", "WON", "ARCHIVED"].includes(item.status)) || item.status === "EXPIRED";
  });

  // Archive action handler
  const handleArchive = async (item: any) => {
    try {
      if (item.type === "Opportunity") {
        await updateOpportunity(password, item.id, { ...item.raw, status: "CLOSED", deadline: item.raw.deadline ? new Date(item.raw.deadline).toISOString() : null });
      } else if (item.type === "Hackathon") {
        await updateHackathon(password, item.id, { ...item.raw, status: "COMPLETED", deadline: item.raw.deadline ? new Date(item.raw.deadline).toISOString() : null });
      } else if (item.type === "Application") {
        await updateApplication(password, item.id, { ...item.raw, status: "REJECTED", appliedDate: item.raw.appliedDate ? new Date(item.raw.appliedDate).toISOString() : null, nextFollowUp: item.raw.nextFollowUp ? new Date(item.raw.nextFollowUp).toISOString() : null });
      } else if (item.type === "Goal") {
        await updateGoal(password, item.id, { ...item.raw, status: "ARCHIVED", targetDate: item.raw.targetDate ? new Date(item.raw.targetDate).toISOString() : null });
      } else if (item.type === "Contact") {
        await updateContact(password, item.id, { ...item.raw, status: "CLOSED", lastContact: item.raw.lastContact ? new Date(item.raw.lastContact).toISOString() : null, nextFollowUp: null });
      }
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (err: any) {
      alert(`Archive failed: ${err.message}`);
    }
  };

  // Helper to format countdown
  const getCountdown = (date: Date) => {
    if (!currentTime) return "...";
    const diffMs = date.getTime() - currentTime;
    if (diffMs < 0) return "Passed";
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) {
      return `${Math.round(diffHours)}h left`;
    }
    const days = Math.round(diffHours / 24);
    return `${days}d left`;
  };

  return (
    <div className={`p-6 rounded-2xl border ${theme.card} space-y-4`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold tracking-tight">Proactive Deadline Watch</h3>
          <p className="text-[10px] text-zinc-500 font-mono">Time-sensitive milestones intelligence</p>
        </div>
        <div className={`flex gap-1 ${theme.nestedBg} border ${theme.border} p-0.5 rounded-lg`}>
          {[
            { id: "urgent", label: "7 Days", count: urgentItems.length },
            { id: "upcoming", label: "30 Days", count: upcomingItems.length },
            { id: "missed", label: "Missed", count: missedItems.length, highlight: missedItems.length > 0 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveWatchTab(tab.id as any)}
              className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
                activeWatchTab === tab.id
                  ? "bg-indigo-600 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  : tab.highlight
                  ? "text-rose-400 hover:text-rose-300"
                  : "text-zinc-550 hover:text-zinc-300"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1 rounded font-mono text-[8px] ${
                  activeWatchTab === tab.id ? "bg-white/20 text-white" : tab.highlight ? "bg-rose-500/10 text-rose-400" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-none">
        {activeWatchTab === "urgent" && (
          urgentItems.length === 0 ? (
            <p className="text-[10px] text-zinc-650 font-mono py-8 text-center">No urgent deadlines in the next 7 days.</p>
          ) : (
            urgentItems.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-2.5 ${theme.nestedBg} border ${theme.border} rounded-xl`}>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-200 truncate pr-2">{item.title}</p>
                  <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{item.type} · Due {item.date.toLocaleDateString()}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25 text-[9px] font-bold font-mono text-rose-400 shrink-0">
                  {getCountdown(item.date)}
                </span>
              </div>
            ))
          )
        )}

        {activeWatchTab === "upcoming" && (
          upcomingItems.length === 0 ? (
            <p className="text-[10px] text-zinc-655 font-mono py-8 text-center">No deadlines in the next 8-30 days.</p>
          ) : (
            upcomingItems.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-2.5 ${theme.nestedBg} border ${theme.border} rounded-xl`}>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-200 truncate pr-2">{item.title}</p>
                  <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{item.type} · Due {item.date.toLocaleDateString()}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-[9px] font-bold font-mono text-indigo-400 shrink-0">
                  {getCountdown(item.date)}
                </span>
              </div>
            ))
          )
        )}

        {activeWatchTab === "missed" && (
          missedItems.length === 0 ? (
            <p className="text-[10px] text-zinc-650 font-mono py-8 text-center">No recently missed deadlines.</p>
          ) : (
            missedItems.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-2.5 ${theme.nestedBg} border border-rose-500/20 rounded-xl`}>
                <div className="min-w-0 mr-2">
                  <p className="text-xs font-bold text-rose-300 truncate">{item.title}</p>
                  <p className="text-[9px] text-rose-500/60 font-mono mt-0.5">{item.type} · Missed {item.date.toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleArchive(item)}
                  className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/35 text-[9px] font-bold font-mono text-rose-400 transition-all shrink-0"
                >
                  Archive
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

// 2. RECRUITER CRM MODULE VIEW
function CRMView({ store, theme, password, onEditContact }: { store: any; theme: any; password: any; onEditContact: (i: any) => void }) {
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [localNotes, setLocalNotes] = useState("");

  const queryClient = useQueryClient();

  const activeContact = useMemo(() => {
    return store.contacts.find((c: any) => c.id === activeContactId) || null;
  }, [store.contacts, activeContactId]);

  useEffect(() => {
    if (activeContact) {
      setLocalNotes(activeContact.notes || "");
    }
  }, [activeContact]);

  const filteredContacts = useMemo(() => {
    return store.contacts.filter((c: any) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.role && c.role.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [store.contacts, searchQuery, statusFilter]);

  const handleSendReply = async () => {
    if (!activeContact || !replyText.trim()) return;

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
        setReplyText("");
        queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (err: any) {
      alert(`Error sending: ${err.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeContact) return;
    setSavingNotes(true);
    try {
      await updateContact(password, activeContact.id, {
        ...activeContact,
        notes: localNotes,
        lastContact: activeContact.lastContact ? new Date(activeContact.lastContact).toISOString() : null,
        nextFollowUp: activeContact.nextFollowUp ? new Date(activeContact.nextFollowUp).toISOString() : null,
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (err: any) {
      alert(`Failed to save notes: ${err.message}`);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!activeContact) return;
    try {
      await updateContact(password, activeContact.id, {
        ...activeContact,
        status: newStatus,
        lastContact: activeContact.lastContact ? new Date(activeContact.lastContact).toISOString() : null,
        nextFollowUp: activeContact.nextFollowUp ? new Date(activeContact.nextFollowUp).toISOString() : null,
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const templates = [
    "Thank you for reaching out! I would love to connect.",
    "Here is a copy of my resume for your review.",
    "I'm available for a call next Tuesday or Thursday afternoon. Let me know what works!",
    "Thank you for the update. I look forward to the next steps.",
  ];

  return (
    <div className={`h-[calc(100vh-140px)] flex border ${theme.border} rounded-2xl ${theme.card.split(" shadow-")[0]} overflow-hidden animate-fadeIn`}>
      {/* PANEL 1: INBOX LIST (320px) */}
      <div className={`w-full md:w-80 border-r ${theme.border} flex flex-col bg-zinc-950/20 divide-y ${theme.border} shrink-0 ${
        activeContactId ? "hidden md:flex" : ""
      }`}>
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-550 font-mono uppercase tracking-widest">
              Inbox Threads ({filteredContacts.length})
            </span>
          </div>
          <div className="relative flex items-center">
            <Search size={12} className="text-zinc-500 absolute left-2.5" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-2.5 py-1.5 rounded-lg text-[11px] font-bold border focus:outline-none focus:border-indigo-500 transition-all ${theme.input}`}
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {["ALL", "NEW", "CONTACTED", "REPLIED", "INTERVIEW", "CLOSED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all shrink-0 border ${
                  statusFilter === status
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : `text-zinc-500 hover:text-zinc-350 border-transparent`
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 scrollbar-none">
          {filteredContacts.length === 0 ? (
            <p className="p-6 text-xs text-zinc-500 font-mono text-center">No matching recruiter leads.</p>
          ) : (
            filteredContacts.map((c: any) => {
              const lastConv = c.conversations?.[0];
              const lastMsg = lastConv?.messages?.[0];
              const isSelected = c.id === activeContactId;
              const urgency = c.nextFollowUp && new Date(c.nextFollowUp) < new Date() ? "border-l-rose-500" : "border-l-transparent";
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveContactId(c.id)}
                  className={`p-4 cursor-pointer text-left transition-all hover:bg-zinc-800/10 border-l-2 ${
                    isSelected ? "bg-indigo-500/5 border-l-indigo-500" : `border-l-transparent ${urgency}`
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs truncate max-w-[140px] text-zinc-200">{c.name}</span>
                    <span className="text-[9px] text-zinc-500 font-mono shrink-0">
                      {lastConv ? new Date(lastConv.lastMessageAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-semibold truncate flex items-center justify-between">
                    <span>{c.company ? `@ ${c.company}` : "Recruiter"}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-black border uppercase tracking-wider ${
                      c.status === "INTERVIEW" ? theme.green : c.status === "CLOSED" ? theme.red : theme.accent
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-550 truncate italic mt-1.5">
                    {lastMsg ? lastMsg.content : "No messages"}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col bg-zinc-950/45 overflow-hidden relative ${
        !activeContactId ? "hidden md:flex" : ""
      }`}>
        {activeContact ? (
          <>
            <header className={`h-14 border-b ${theme.border} px-6 flex items-center justify-between bg-zinc-900/10 shrink-0`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveContactId(null)}
                  className="md:hidden p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  <ChevronRight className="rotate-180" size={14} />
                </button>
                <div>
                  <h3 className="font-bold text-xs text-zinc-200">{activeContact.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {activeContact.email} {activeContact.role ? `· ${activeContact.role}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => onEditContact(activeContact)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800/40 text-[10px] font-bold uppercase transition-all"
                >
                  Edit profile
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
              {activeContact.conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2">
                  <Inbox size={20} className="text-zinc-650" />
                  <p className="text-xs text-zinc-555 font-mono">No conversation thread started yet.</p>
                </div>
              ) : (
                activeContact.conversations.map((conv: any) => (
                  <div key={conv.id} className="space-y-4">
                    <div className="flex items-center gap-3 my-4">
                      <div className={`h-px flex-1 ${theme.border}`} />
                      <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-3">
                        Subject: {conv.subject}
                      </span>
                      <div className={`h-px flex-1 ${theme.border}`} />
                    </div>

                    {conv.messages.map((m: any) => {
                      const isSurya = m.senderType === "SURYA";
                      const senderInitial = isSurya ? "S" : activeContact.name.substring(0, 1).toUpperCase();
                      return (
                        <div key={m.id} className={`flex items-start gap-2.5 ${isSurya ? "justify-end" : "justify-start"}`}>
                          {!isSurya && (
                            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-355 shrink-0 shadow-[1px_1px_0px_0px_#18181b]">
                              {senderInitial}
                            </div>
                          )}
                          <div className="max-w-[70%] space-y-1">
                            <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                              isSurya
                                ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 rounded-tr-none"
                                : "bg-[#0e0e11] border border-zinc-800 text-zinc-200 rounded-tl-none shadow-[2px_2px_0px_0px_#18181b]"
                            }`}>
                              {m.content}
                            </div>
                            <p className="text-[8px] font-mono text-zinc-500 text-right px-1">
                              {new Date(m.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {isSurya && (
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0 shadow-[1px_1px_0px_0px_#4f46e5]">
                              {senderInitial}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <footer className={`p-4 border-t ${theme.border} bg-zinc-900/10 shrink-0`}>
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <Sparkles size={11} className="text-zinc-500 shrink-0" />
                  <span className="text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-wider shrink-0 mr-1.5">
                    Templates:
                  </span>
                  {templates.map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => setReplyText((prev) => (prev ? prev + "\n" + tpl : tpl))}
                      className="px-2 py-0.5 rounded bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 text-[9px] font-semibold truncate max-w-[150px] transition-all cursor-pointer"
                      title={tpl}
                    >
                      {tpl}
                    </button>
                  ))}
                </div>

                <div className={`bg-zinc-950/80 border ${theme.border} rounded-xl p-3 flex flex-col`}>
                  <textarea
                    rows={2}
                    placeholder={`Reply to ${activeContact.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="bg-transparent text-zinc-200 placeholder-zinc-700 text-xs focus:outline-none resize-none scrollbar-none"
                  />
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-800/60">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Via CareerOS Resend Integration
                    </span>
                    <button
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyText.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase transition-all"
                    >
                      <Send size={11} />
                      {sendingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
            <Inbox size={24} className="text-zinc-600" />
            <div>
              <h4 className="text-xs font-bold text-zinc-300">No Recruiter Conversation Selected</h4>
              <p className="text-[11px] text-zinc-500 max-w-xs mt-1">
                Choose a recruiter contact thread from the list on the left to read messages and reply.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PANEL 3: CONTACT METADATA DRAWER (280px) */}
      <div className={`hidden lg:flex flex-col w-72 border-l ${theme.border} bg-zinc-950/20 divide-y ${theme.border} shrink-0`}>
        {activeContact ? (
          <div className="flex-1 flex flex-col divide-y divide-zinc-800/40 overflow-y-auto scrollbar-none">
            <div className="p-5 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-lg text-indigo-400">
                {activeContact.name.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-200">{activeContact.name}</h4>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">{activeContact.role || "Recruiter"} {activeContact.company ? `@ ${activeContact.company}` : ""}</p>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onEditContact(activeContact)}
                  className="px-2.5 py-1 rounded-lg border border-zinc-800 hover:bg-zinc-800/40 text-[9px] font-bold uppercase tracking-wider transition-all"
                >
                  Edit Profile
                </button>
                {activeContact.linkedin && (
                  <a
                    href={activeContact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-lg border border-zinc-800 hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-all flex items-center justify-center"
                    title="LinkedIn Profile"
                  >
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-wider">Status</span>
                <select
                  value={activeContact.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className={`w-full p-2 rounded-lg text-xs border ${theme.input}`}
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="REPLIED">REPLIED</option>
                  <option value="NETWORKING">NETWORKING</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-zinc-500 font-mono uppercase tracking-wider">Last Contact</span>
                  <p className="text-[10px] font-mono text-zinc-400 border border-zinc-800 p-2 rounded-lg bg-[#0e0e11]">
                    {activeContact.lastContact ? new Date(activeContact.lastContact).toLocaleDateString() : "Never"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-zinc-500 font-mono uppercase tracking-wider">Follow Up</span>
                  <p className={`text-[10px] font-mono border p-2 rounded-lg bg-[#0e0e11] ${
                    activeContact.nextFollowUp && new Date(activeContact.nextFollowUp) < new Date()
                      ? "border-rose-500/30 text-rose-400 font-bold"
                      : "border-zinc-800 text-zinc-400"
                  }`}>
                    {activeContact.nextFollowUp ? new Date(activeContact.nextFollowUp).toLocaleDateString() : "None"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col min-h-[200px] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-wider">Private Notes</span>
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="flex items-center gap-1 text-[9px] font-bold font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-wider"
                >
                  <Save size={10} />
                  {savingNotes ? "Saving..." : "Save"}
                </button>
              </div>
              <textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Write private notes on recruiter feedback..."
                className="flex-1 w-full p-2.5 rounded-lg text-xs bg-[#16161c] border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none scrollbar-none font-mono"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-zinc-500 font-mono text-[10px]">
            Select recruiter
          </div>
        )}
      </div>
    </div>
  );
}

// 3. OPPORTUNITIES MODULE VIEW
function OpportunitiesView({ store, theme, password, onAddOpportunity, onEditOpportunity, onDeleteOpportunity }: { store: any; theme: any; password: any; onAddOpportunity: () => void; onEditOpportunity: (i: any) => void; onDeleteOpportunity: (id: string) => void }) {
  const queryClient = useQueryClient();

  // Handle status update mutation
  const handleStatusChange = async (id: string, newStatus: string) => {
    const opp = store.opportunities.find((o: any) => o.id === id);
    if (!opp) return;

    try {
      await updateOpportunity(password, id, {
        ...opp,
        status: newStatus,
        deadline: opp.deadline ? new Date(opp.deadline).toISOString() : null,
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (e: any) {
      alert(`Update status failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Opportunities Listing</h2>
          <p className="text-xs text-zinc-500 font-mono">Manage jobs, internships, startups, and collaborations</p>
        </div>
        <button
          onClick={onAddOpportunity}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide transition-all"
        >
          <Plus size={12} /> Add Opportunity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {OPPORTUNITY_STATUSES.slice(0, 4).map((status) => {
          const list = store.opportunities.filter((o: any) => o.status === status);
          return (
            <div key={status} className={`p-4 rounded-2xl border ${theme.card} space-y-4`}>
              <div className={`flex justify-between items-center border-b-2 ${theme.border} pb-2`}>
                <span className="text-[10px] font-bold text-zinc-450 font-mono uppercase tracking-widest">
                  {status}
                </span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono font-bold px-2 py-0.5 rounded-full">
                  {list.length}
                </span>
              </div>
              <div className="space-y-3.5 max-h-96 overflow-y-auto scrollbar-none">
                {list.length === 0 ? (
                  <p className="text-[10px] text-zinc-650 font-mono py-4 text-center">Empty column</p>
                ) : (
                  list.map((opp: any) => {
                    const isExpired = opp.status === "EXPIRED" || (opp.deadline && new Date(opp.deadline) < new Date());
                    const borderClass = isExpired
                      ? "border-rose-500/35 hover:border-rose-500/60"
                      : `${theme.border} hover:border-indigo-500/30`;
                    return (
                      <div key={opp.id} className={`p-3 ${theme.nestedBg} border rounded-xl space-y-2 relative group transition-all ${borderClass}`}>
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-xs font-bold text-zinc-200">{opp.title}</h4>
                            {isExpired && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-[8px] font-bold text-rose-400 uppercase font-mono tracking-wider shrink-0 scale-90">
                                Expired
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-400 font-semibold">{opp.company}</p>
                        </div>
                        {opp.deadline && (
                          <p className="text-[9px] text-zinc-500 font-mono">
                            Deadline: {new Date(opp.deadline).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-[9px] pt-1">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider scale-90 -translate-x-1">
                            {opp.type}
                          </span>
                          <PriorityBadge priority={opp.priority} />
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t-2 border-inherit opacity-0 group-hover:opacity-100 transition-all">
                        <select
                          value={opp.status}
                          onChange={(e) => handleStatusChange(opp.id, e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 text-zinc-300 rounded text-[9px] px-1 focus:outline-none"
                        >
                          {OPPORTUNITY_STATUSES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <button onClick={() => onEditOpportunity(opp)} className="text-zinc-400 hover:text-indigo-400 text-[10px]">
                          Edit
                        </button>
                        <button onClick={() => onDeleteOpportunity(opp.id)} className="text-rose-500 hover:text-rose-400 text-[10px]">
                          Delete
                        </button>
                      </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. HACKATHONS MODULE VIEW
function HackathonsView({ store, theme, password, onAddHackathon, onEditHackathon, onDeleteHackathon }: { store: any; theme: any; password: any; onAddHackathon: () => void; onEditHackathon: (i: any) => void; onDeleteHackathon: (id: string) => void }) {
  const [subView, setSubView] = useState<"kanban" | "table" | "calendar">("kanban");

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Hackathon Tracker</h2>
          <p className="text-xs text-zinc-500 font-mono">Participations, projects submission dates, and rankings</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 ${theme.nestedBg} border ${theme.border} p-0.5 rounded-lg`}>
            {(["kanban", "table", "calendar"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSubView(view)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                  subView === view ? "bg-indigo-600 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <button
            onClick={onAddHackathon}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-xs uppercase tracking-wide transition-all"
          >
            <Plus size={12} /> Add Hackathon
          </button>
        </div>
      </div>

      {subView === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {HACKATHON_STATUSES.slice(0, 4).map((status) => {
            const list = store.hackathons.filter((h: any) => h.status === status);
            return (
              <div key={status} className={`p-4 rounded-2xl border ${theme.card} space-y-4`}>
                <div className={`flex justify-between items-center border-b-2 ${theme.border} pb-2`}>
                  <span className="text-[10px] font-bold text-zinc-450 font-mono uppercase tracking-widest">
                    {status}
                  </span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono font-bold px-2 py-0.5 rounded-full">
                    {list.length}
                  </span>
                </div>
                <div className="space-y-3.5 max-h-96 overflow-y-auto scrollbar-none">
                  {list.length === 0 ? (
                    <p className="text-[10px] text-zinc-650 font-mono py-4 text-center">Empty column</p>
                  ) : (
                    list.map((hack: any) => {
                      const isExpired = hack.status === "EXPIRED" || (hack.deadline && new Date(hack.deadline) < new Date());
                      const priority = getUrgencyPriority(hack.deadline);
                      const borderClass = isExpired
                        ? "border-rose-500/35 hover:border-rose-500/60"
                        : `${theme.border} hover:border-indigo-500/30`;
                      return (
                        <div key={hack.id} className={`p-3 ${theme.nestedBg} border rounded-xl space-y-2 relative group transition-all ${borderClass}`}>
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-xs font-bold text-zinc-200">{hack.name}</h4>
                              {isExpired && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-[8px] font-bold text-rose-400 uppercase font-mono tracking-wider shrink-0 scale-90">
                                  Expired
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-400 font-semibold">{hack.organizer}</p>
                          </div>
                          {hack.deadline && (
                            <p className="text-[9px] text-zinc-500 font-mono">
                              Deadline: {new Date(hack.deadline).toLocaleDateString()}
                            </p>
                          )}
                          <div className="flex justify-between items-center text-[9px] pt-1">
                            <span className="text-zinc-550 text-[8px] font-mono uppercase tracking-wider font-bold">
                              Submissions
                            </span>
                            <PriorityBadge priority={priority} />
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t-2 border-inherit opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => onEditHackathon(hack)} className="text-indigo-400 hover:text-indigo-300 text-[10px]">
                              Edit
                            </button>
                            <button onClick={() => onDeleteHackathon(hack.id)} className="text-rose-500 hover:text-rose-400 text-[10px]">
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                  })
                )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {subView === "table" && (
        <div className={`border ${theme.border} rounded-xl bg-inherit overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b-2 ${theme.border} bg-zinc-900/30 font-mono font-bold text-zinc-400`}>
                <th className="p-4">Name</th>
                <th className="p-4">Organizer</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y-2 ${theme.border}`}>
              {store.hackathons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-zinc-500 font-mono">No hackathons recorded.</td>
                </tr>
              ) : (
                store.hackathons.map((h: any) => (
                  <tr key={h.id} className="hover:bg-zinc-800/20">
                    <td className="p-4 font-bold">{h.name}</td>
                    <td className="p-4 text-zinc-400">{h.organizer}</td>
                    <td className="p-4 font-mono text-zinc-500">
                      {h.deadline ? new Date(h.deadline).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                        h.status === "WON" ? theme.green : theme.accent
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => onEditHackathon(h)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                      <button onClick={() => onDeleteHackathon(h.id)} className="text-rose-500 hover:text-rose-400">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {subView === "calendar" && (
        <CalendarView items={store.hackathons} titleKey="name" dateKey="deadline" theme={theme} />
      )}
    </div>
  );
}

// 5. APPLICATIONS TRACKER MODULE VIEW
function ApplicationsView({ store, theme, password, onAddApplication, onEditApplication, onDeleteApplication }: { store: any; theme: any; password: any; onAddApplication: () => void; onEditApplication: (i: any) => void; onDeleteApplication: (id: string) => void }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Job Applications Tracker</h2>
          <p className="text-xs text-zinc-500 font-mono">Job & internship applications, response statuses, and OA tests</p>
        </div>
        <button
          onClick={onAddApplication}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide transition-all"
        >
          <Plus size={12} /> Add Application
        </button>
      </div>

      <div className={`border-2 ${theme.border} rounded-xl bg-inherit overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b-2 ${theme.border} bg-zinc-900/30 font-mono font-bold text-zinc-400`}>
              <th className="p-4">Company</th>
              <th className="p-4">Role</th>
              <th className="p-4">Applied Date</th>
              <th className="p-4">Follow Up</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y-2 ${theme.border}`}>
            {store.applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-zinc-500 font-mono">No job applications recorded.</td>
              </tr>
            ) : (
              store.applications.map((app: any) => {
                const isExpired = app.status === "EXPIRED" || (app.nextFollowUp && new Date(app.nextFollowUp) < new Date() && app.status !== "OFFER" && app.status !== "REJECTED");
                return (
                  <tr key={app.id} className={`hover:bg-zinc-800/20 ${isExpired ? "bg-rose-500/5 text-rose-250 border-rose-500/20" : ""}`}>
                    <td className="p-4 font-bold flex items-center gap-2">
                      {app.company}
                      {isExpired && (
                        <span className="px-1.5 py-0.2 bg-rose-500/10 text-[8px] font-bold border border-rose-500/25 text-rose-400 uppercase tracking-widest font-mono rounded scale-90">
                          Missed Follow-up
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-zinc-400 font-semibold">{app.role}</td>
                    <td className="p-4 font-mono text-zinc-500">
                      {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4 font-mono text-zinc-500">
                      {app.nextFollowUp ? new Date(app.nextFollowUp).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                        app.status === "OFFER" ? theme.green : (app.status === "REJECTED" || app.status === "EXPIRED") ? theme.red : theme.accent
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => onEditApplication(app)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                      <button onClick={() => onDeleteApplication(app.id)} className="text-rose-500 hover:text-rose-400">Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. EVENT PLANNER MODULE VIEW
function EventsView({ store, theme, password, onAddEvent, onEditEvent, onDeleteEvent }: { store: any; theme: any; password: any; onAddEvent: () => void; onEditEvent: (i: any) => void; onDeleteEvent: (id: string) => void }) {
  const [activeSubView, setActiveSubView] = useState<"calendar" | "agenda">("calendar");

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Event Planner</h2>
          <p className="text-xs text-zinc-500 font-mono">Conferences, workshops, college meetups, and schedules</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 ${theme.nestedBg} border ${theme.border} p-0.5 rounded-lg`}>
            {(["calendar", "agenda"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveSubView(view)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                  activeSubView === view ? "bg-indigo-600 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <button
            onClick={onAddEvent}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide transition-all"
          >
            <Plus size={12} /> Add Event
          </button>
        </div>
      </div>

      {activeSubView === "calendar" ? (
        <CalendarView items={store.events} titleKey="title" dateKey="startDate" theme={theme} />
      ) : (
        <div className="space-y-4">
          {store.events.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border border-dashed ${theme.border} text-zinc-500`}>
              No events scheduled in agenda.
            </div>
          ) : (
            store.events.map((evt: any) => (
              <div key={evt.id} className={`p-4 rounded-xl border ${theme.card} flex items-center justify-between`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${theme.accent}`}>
                      {evt.category}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-200">{evt.title}</h4>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {new Date(evt.startDate).toLocaleDateString()} @ {evt.location || "Online"}
                  </p>
                </div>
                <div className="flex gap-3 text-xs font-semibold">
                  <button onClick={() => onEditEvent(evt)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                  <button onClick={() => onDeleteEvent(evt.id)} className="text-rose-500 hover:text-rose-400">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// 7. LEARNING ROADMAP MODULE VIEW
function RoadmapView({ store, theme, password, onAddRoadmap, onEditRoadmap, onDeleteRoadmap }: { store: any; theme: any; password: any; onAddRoadmap: () => void; onEditRoadmap: (i: any) => void; onDeleteRoadmap: (id: string) => void }) {
  const queryClient = useQueryClient();

  const handleProgressSlider = async (id: string, val: number) => {
    const roadmap = store.roadmaps.find((r: any) => r.id === id);
    if (!roadmap) return;

    try {
      await updateLearningRoadmap(password, id, {
        ...roadmap,
        progress: val,
        targetDate: roadmap.targetDate ? new Date(roadmap.targetDate).toISOString() : null,
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    } catch (e: any) {
      alert(`Update progress failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Learning Syllabus Roadmaps</h2>
          <p className="text-xs text-zinc-500 font-mono">Track syllabus, technical topics, reading items and progress milestones</p>
        </div>
        <button
          onClick={onAddRoadmap}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide transition-all"
        >
          <Plus size={12} /> Add Topic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {store.roadmaps.length === 0 ? (
          <p className="col-span-2 p-12 text-center text-zinc-500 font-mono border border-dashed border-[#161623] rounded-2xl">
            No active roadmaps found. Add technical syllabus to track learning goals.
          </p>
        ) : (
          store.roadmaps.map((map: any) => (
            <div key={map.id} className={`p-6 rounded-2xl border ${theme.card} space-y-4`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest">
                    {map.category || "General"}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-200 mt-0.5">{map.topic}</h4>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEditRoadmap(map)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                    Edit
                  </button>
                  <button onClick={() => onDeleteRoadmap(map.id)} className="text-xs font-semibold text-rose-500 hover:text-rose-400">
                    Delete
                  </button>
                </div>
              </div>

              {/* Progress Slider representation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Mastery progress:</span>
                  <span className="font-bold text-indigo-400">{map.progress}%</span>
                </div>
                <div className={`relative w-full h-2.5 bg-zinc-850 rounded-full border ${theme.border}`}>
                  <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all" style={{ width: `${map.progress}%` }} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={map.progress}
                    onChange={(e) => handleProgressSlider(map.id, parseInt(e.target.value))}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {map.resources && (
                <div className={`p-3 ${theme.nestedBg} border ${theme.border} rounded-xl text-[11px] text-zinc-500 font-mono whitespace-pre-wrap leading-normal`}>
                  {map.resources}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 8. GOALS SYSTEM MODULE VIEW
function GoalsView({ store, theme, password, onAddGoal, onEditGoal, onDeleteGoal }: { store: any; theme: any; password: any; onAddGoal: () => void; onEditGoal: (i: any) => void; onDeleteGoal: (id: string) => void }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Structured Goal Tracker</h2>
          <p className="text-xs text-zinc-500 font-mono">Annual, Quarterly, Monthly, and Weekly metrics tracking goals</p>
        </div>
        <button
          onClick={onAddGoal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide transition-all"
        >
          <Plus size={12} /> Define Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {GOAL_CATEGORIES.map((category) => {
          const list = store.goals.filter((g: any) => g.category === category);
          return (
            <div key={category} className={`p-4 rounded-2xl border ${theme.card} space-y-4`}>
              <div className="flex justify-between items-center border-b border-[#161623] pb-2">
                <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-widest">
                  {category}
                </span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono font-bold px-2 py-0.5 rounded-full">
                  {list.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[450px] overflow-y-auto scrollbar-none">
                {list.length === 0 ? (
                  <p className="text-[10px] text-zinc-650 font-mono py-4 text-center">No goals set</p>
                ) : (
                  list.map((goal: any) => (
                    <div key={goal.id} className={`p-3 ${theme.nestedBg} border ${theme.border} rounded-xl space-y-3 relative group hover:border-indigo-500/30 transition-all`}>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-200">{goal.title}</h4>
                        <p className="text-[10px] text-zinc-500 mt-1">{goal.description}</p>
                      </div>

                      {/* Mini Goal Progress slider visual */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                          <span>Progress:</span>
                          <span className="font-bold">{goal.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] pt-1">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold border uppercase ${
                          goal.status === "COMPLETED" ? theme.green : theme.orange
                        }`}>
                          {goal.status}
                        </span>
                        {goal.targetDate && (
                          <span className="text-zinc-500 font-mono">
                            By {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-[#131320]/60 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => onEditGoal(goal)} className="text-indigo-400 hover:text-indigo-300 text-[10px]">
                          Edit
                        </button>
                        <button onClick={() => onDeleteGoal(goal.id)} className="text-rose-500 hover:text-rose-400 text-[10px]">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 9. NETWORKING DIRECTORY VIEW
function NetworkingView({ store, theme, password, onAddContact, onEditContact, onDeleteContact }: { store: any; theme: any; password: any; onAddContact: () => void; onEditContact: (i: any) => void; onDeleteContact: (id: string) => void }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Networking Tracker</h2>
          <p className="text-xs text-zinc-500 font-mono">Manage professional connections, LinkedIn profiles, and follow ups</p>
        </div>
        <button
          onClick={onAddContact}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide transition-all"
        >
          <Plus size={12} /> Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {store.contacts.length === 0 ? (
          <p className="col-span-3 p-12 text-center text-zinc-500 font-mono border border-dashed border-[#161623] rounded-2xl">
            No contacts recorded. Add professional networking contacts to track.
          </p>
        ) : (
          store.contacts.map((c: any) => (
            <div key={c.id} className={`p-5 rounded-2xl border ${theme.card} space-y-4 relative group hover:border-indigo-500/30 transition-all`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-zinc-200">{c.name}</h4>
                  <p className="text-xs text-zinc-400 font-semibold">{c.role ? `${c.role} ` : ""}{c.company ? `@ ${c.company}` : ""}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border uppercase ${theme.accent}`}>
                  {c.status}
                </span>
              </div>

              <div className={`space-y-1.5 text-xs text-zinc-500 font-mono border-t-2 ${theme.border} pt-3`}>
                <p>Email: <span className="text-zinc-300 font-medium">{c.email}</span></p>
                {c.linkedin && (
                  <p className="flex items-center gap-1">
                    LinkedIn:{" "}
                    <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline flex items-center gap-0.5">
                      View profile <ExternalLink size={10} />
                    </a>
                  </p>
                )}
                {c.nextFollowUp && (
                  <p className="text-amber-400 font-bold">
                    Follow-up: {new Date(c.nextFollowUp).toLocaleDateString()}
                  </p>
                )}
              </div>

              {c.notes && (
                <p className="text-[11px] text-zinc-500 italic truncate max-w-full">
                  Notes: {c.notes}
                </p>
              )}

              <div className={`flex justify-end gap-3 pt-3 border-t-2 ${theme.border} opacity-0 group-hover:opacity-100 transition-all`}>
                <button onClick={() => onEditContact(c)} className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold">
                  Edit
                </button>
                <button onClick={() => onDeleteContact(c.id)} className="text-rose-500 hover:text-rose-400 text-xs font-semibold">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 10. NOTES MODULE VIEW
function NotesView({ store, theme, password, onAddNote, onEditNote, onDeleteNote }: { store: any; theme: any; password: any; onAddNote: () => void; onEditNote: (i: any) => void; onDeleteNote: (id: string) => void }) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const activeNote = useMemo(() => {
    return store.notes.find((n: any) => n.id === selectedNoteId) || null;
  }, [store.notes, selectedNoteId]);

  return (
    <div className={`h-[calc(100vh-140px)] flex border-2 ${theme.border} rounded-xl bg-inherit overflow-hidden animate-fadeIn`}>
      {/* Sidebar selection */}
      <div className={`w-80 border-r-2 ${theme.border} flex flex-col bg-zinc-950/20 divide-y-2 ${theme.border} shrink-0`}>
        <div className="p-4 flex justify-between items-center bg-zinc-900/10">
          <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest">
            Notes ({store.notes.length})
          </span>
          <button onClick={onAddNote} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-0.5 uppercase">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#131320]/60">
          {store.notes.length === 0 ? (
            <p className="p-6 text-xs text-zinc-500 font-mono text-center">No notes recorded.</p>
          ) : (
            store.notes.map((n: any) => {
              const isSelected = n.id === selectedNoteId;
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNoteId(n.id)}
                  className={`p-4 cursor-pointer text-left transition-all hover:bg-zinc-800/20 border-l-2 ${
                    isSelected ? "bg-indigo-500/5 border-l-indigo-500" : "border-l-transparent"
                  }`}
                >
                  <h4 className="font-bold text-xs truncate text-zinc-200">{n.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1">
                    {new Date(n.updatedAt).toLocaleDateString()}
                  </p>
                  {n.tags && (
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {n.tags.split(",").map((t: string) => (
                        <span key={t} className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Editor/Reader Workspace */}
      <div className={`flex-1 flex flex-col ${theme.nestedBg} overflow-y-auto p-8 relative`}>
        {activeNote ? (
          <div className="space-y-6">
            <div className={`flex justify-between items-start border-b-2 ${theme.border} pb-4`}>
              <div>
                <h3 className="text-xl font-bold text-zinc-100">{activeNote.title}</h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3 text-xs font-semibold">
                <button onClick={() => onEditNote(activeNote)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                <button onClick={() => onDeleteNote(activeNote.id)} className="text-rose-500 hover:text-rose-400">Delete</button>
              </div>
            </div>

            <div className="text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
              {activeNote.content}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-zinc-650">
            <FileText size={24} className="text-zinc-600" />
            <div>
              <h4 className="text-xs font-bold text-zinc-300">No Note Selected</h4>
              <p className="text-[11px] text-zinc-500 max-w-xs mt-1">
                Select a document from the panel on the left to read or configure note entries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 11. REMINDER ENGINE MODULE VIEW
function RemindersView({ store, theme, password, onAddReminder, onToggleCompleted, onDeleteReminder }: { store: any; theme: any; password: any; onAddReminder: () => void; onToggleCompleted: (id: string, completed: boolean) => void; onDeleteReminder: (id: string) => void }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold tracking-tight">System Reminders</h2>
          <p className="text-xs text-zinc-500 font-mono">Reminders engine, email notifications, and alerts statuses</p>
        </div>
        <button
          onClick={onAddReminder}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide transition-all"
        >
          <Plus size={12} /> Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending Section */}
        <div className={`p-6 rounded-2xl border ${theme.card} space-y-4`}>
          <h3 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-widest">
            Pending Reminders
          </h3>
          <div className="space-y-3">
            {store.reminders.filter((r: any) => !r.completed).length === 0 ? (
              <p className="text-xs text-zinc-500 font-mono py-4 text-center">No pending reminders.</p>
            ) : (
              store.reminders.filter((r: any) => !r.completed).map((rem: any) => (
                <div key={rem.id} className={`p-3 ${theme.nestedBg} border ${theme.border} rounded-xl flex items-center justify-between shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => onToggleCompleted(rem.id, true)}
                      className="mt-1 accent-indigo-500 cursor-pointer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{rem.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{rem.message}</p>
                      <p className="text-[9px] text-amber-400 font-bold font-mono mt-1">
                        Trigger: {new Date(rem.reminderDate).toLocaleString()} (Type: {rem.type})
                      </p>
                    </div>
                  </div>
                  <button onClick={() => onDeleteReminder(rem.id)} className="text-rose-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Section */}
        <div className={`p-6 rounded-2xl border ${theme.card} space-y-4`}>
          <h3 className="text-xs font-bold text-zinc-500 font-mono uppercase tracking-widest">
            Dispatched & Completed Reminders
          </h3>
          <div className="space-y-3">
            {store.reminders.filter((r: any) => r.completed).length === 0 ? (
              <p className="text-xs text-zinc-500 font-mono py-4 text-center">No completed reminders.</p>
            ) : (
              store.reminders.filter((r: any) => r.completed).map((rem: any) => (
                <div key={rem.id} className={`p-3 ${theme.nestedBg} border ${theme.border} rounded-xl flex items-center justify-between opacity-60`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => onToggleCompleted(rem.id, false)}
                      className="mt-1 accent-indigo-500 cursor-pointer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 line-through">{rem.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{rem.message}</p>
                      <p className="text-[9px] text-zinc-650 font-mono mt-1">
                        Completed at: {new Date(rem.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => onDeleteReminder(rem.id)} className="text-rose-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 12. TIMELINE MODULE VIEW
function TimelineView({ store, theme }: { store: any; theme: any }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold tracking-tight">System Activities</h2>
        <p className="text-xs text-zinc-500 font-mono">Audit trails, notifications log, and automated CRM histories</p>
      </div>

      <div className={`relative border-l-2 ${theme.border} ml-4 pl-6 space-y-6 py-4`}>
        {store.activityLogs.length === 0 ? (
          <p className="text-xs text-zinc-500 font-mono">No logs recorded yet.</p>
        ) : (
          store.activityLogs.map((log: any) => (
            <div key={log.id} className="relative">
              {/* Dot decoration */}
              <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-[#07070a]" />
              <div className={`p-4 rounded-xl border ${theme.card} space-y-2`}>
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-200">{log.action}</h4>
                  <span className="text-[9px] text-zinc-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                {log.metadata && (
                  <div className={`p-2.5 ${theme.nestedBg} border ${theme.border} rounded-lg text-[10px] text-zinc-500 font-mono whitespace-pre-wrap truncate`}>
                    {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── REUSE-ABLE GRAPHICS CALENDAR MONTH GRID ─────────────────────────────────
function CalendarView({ items, titleKey, dateKey, theme }: { items: any[]; titleKey: string; dateKey: string; theme: any }) {
  // Calendar month rendering
  const daysInMonth = 30; // Simply mock grid for demo stability
  return (
    <div className={`border-2 ${theme.border} rounded-xl bg-inherit shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden p-6 space-y-4`}>
      <div className={`flex justify-between items-center border-b-2 ${theme.border} pb-3`}>
        <span className="text-xs font-bold text-zinc-300 uppercase">Upcoming Calendar Items</span>
        <span className="text-[10px] text-zinc-500 font-mono">Active month agenda</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day} className="text-center text-[10px] font-bold font-mono text-zinc-500 uppercase py-1">
            {day}
          </span>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNum = index + 1;
          const dayItems = items.filter((item) => {
            if (!item[dateKey]) return false;
            const itemDate = new Date(item[dateKey]).getDate();
            return itemDate === dayNum;
          });

          return (
            <div key={index} className={`min-h-20 ${theme.nestedBg} border ${theme.border} rounded-xl p-2 flex flex-col justify-between group hover:border-indigo-500/20 transition-all`}>
              <span className="text-[10px] font-bold font-mono text-zinc-500">{dayNum}</span>
              <div className="space-y-1">
                {dayItems.slice(0, 3).map((di, idx) => {
                  let colorClasses = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
                  if (di.category) {
                    const cat = String(di.category).toUpperCase();
                    if (cat.includes("WORKSHOP")) {
                      colorClasses = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
                    } else if (cat.includes("CONFERENCE")) {
                      colorClasses = "bg-amber-500/10 border-amber-500/20 text-amber-400";
                    } else if (cat.includes("MEETUP")) {
                      colorClasses = "bg-purple-500/10 border-purple-500/20 text-purple-400";
                    } else if (cat.includes("HACKATHON")) {
                      colorClasses = "bg-sky-500/10 border-sky-500/20 text-sky-400";
                    }
                  } else if (di.status) {
                    const st = String(di.status).toUpperCase();
                    if (st === "WON") {
                      colorClasses = "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
                    } else if (st === "REGISTERED") {
                      colorClasses = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
                    } else if (st === "PLANNING" || st === "RESEARCHING") {
                      colorClasses = "bg-sky-500/10 border-sky-500/20 text-sky-400";
                    } else if (st === "SUBMITTED") {
                      colorClasses = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
                    } else if (st === "EXPIRED") {
                      colorClasses = "bg-rose-500/10 border-rose-500/20 text-rose-400";
                    }
                  }
                  return (
                    <div key={idx} className={`border rounded px-1.5 py-0.5 text-[8px] font-extrabold truncate max-w-full leading-tight ${colorClasses}`} title={di[titleKey]}>
                      {di[titleKey]}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMMAND PALETTE KEYBOARD OVERLAY ──────────────────────────────────────────
function CommandPaletteOverlay({ theme, onClose, onTriggerAction }: { theme: any; onClose: () => void; onTriggerAction: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands = useMemo(() => {
    const list = [
      { id: "add-opp", label: "Add Opportunity Listing", desc: "Create a job, internship, or freelance entry" },
      { id: "add-hack", label: "Create Hackathon Item", desc: "Register a hackathon tracker" },
      { id: "add-app", label: "Create Job Application Tracker", desc: "Track custom job application OA status" },
      { id: "add-evt", label: "Create Event Scheduler", desc: "Add meetups, webinars or workshops schedules" },
      { id: "add-goal", label: "Define Annual/Weekly Goal", desc: "Set target achievements goals" },
      { id: "add-contact", label: "Add Networking Connection", desc: "Register professional contact notes" },
      { id: "add-note", label: "Write Markdown Note Document", desc: "Save research items, startup ideas" },
      { id: "add-reminder", label: "Schedule Email Notification", desc: "Set dashboard alerts and trigger engines" },
    ];
    if (!query) return list;
    return list.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="fixed inset-0 bg-zinc-950/65 backdrop-blur-sm flex items-start justify-center pt-24 z-50 animate-fadeIn" onClick={onClose}>
      <div className={`w-full max-w-xl border-2 ${theme.border} rounded-xl bg-[#0e0e11] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col`} onClick={(e) => e.stopPropagation()}>
        <div className={`p-4 border-b-2 ${theme.border} relative flex items-center bg-zinc-900/10`}>
          <Search size={16} className="absolute left-4 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent pl-8 focus:outline-none text-xs text-zinc-100 placeholder-zinc-500 font-bold font-mono"
          />
        </div>
        <div className="p-2 max-h-80 overflow-y-auto divide-y divide-zinc-800/40">
          {commands.length === 0 ? (
            <p className="text-xs text-zinc-500 font-mono py-6 text-center">No commands match.</p>
          ) : (
            commands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => onTriggerAction(cmd.id)}
                className={`w-full text-left p-3 rounded-lg transition-all flex flex-col gap-0.5 ${theme.hover}`}
              >
                <span className="text-xs font-bold text-zinc-200">{cmd.label}</span>
                <span className="text-[10px] text-zinc-500 font-medium">{cmd.desc}</span>
              </button>
            ))
          )}
        </div>
        <div className={`p-3 border-t-2 ${theme.border} bg-zinc-900/20 flex justify-between items-center text-[9px] text-zinc-500 font-mono`}>
          <span>↑↓ to navigate · enter to select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}

// ─── DYNAMIC DIALOG COMPONENT PANEL ───────────────────────────────────────────
function ModalPanel({ type, theme, password, item, onClose, onSuccess }: { type: string; theme: any; password: any; item: any; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      const timer = setTimeout(() => {
        setFormData({
          ...item,
          // Format dates correctly for inputs
          deadline: item.deadline ? new Date(item.deadline).toISOString().substring(0, 10) : "",
          eventDate: item.eventDate ? new Date(item.eventDate).toISOString().substring(0, 10) : "",
          appliedDate: item.appliedDate ? new Date(item.appliedDate).toISOString().substring(0, 10) : "",
          nextFollowUp: item.nextFollowUp ? new Date(item.nextFollowUp).toISOString().substring(0, 10) : "",
          startDate: item.startDate ? new Date(item.startDate).toISOString().substring(0, 16) : "",
          endDate: item.endDate ? new Date(item.endDate).toISOString().substring(0, 16) : "",
          reminderDate: item.reminderDate ? new Date(item.reminderDate).toISOString().substring(0, 16) : "",
          targetDate: item.targetDate ? new Date(item.targetDate).toISOString().substring(0, 10) : "",
        });
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // Setup default placeholder schema
        if (type === "opportunity") setFormData({ status: "DISCOVERED", type: "INTERNSHIP", priority: "MEDIUM" });
        if (type === "hackathon") setFormData({ status: "RESEARCHING" });
        if (type === "application") setFormData({ status: "SAVED" });
        if (type === "event") setFormData({ category: "HACKATHON" });
        if (type === "roadmap") setFormData({ progress: 0 });
        if (type === "goal") setFormData({ category: "WEEKLY", status: "ACTIVE", progress: 0 });
        if (type === "contact") setFormData({ status: "NEW" });
        if (type === "reminder") setFormData({ type: "BOTH" });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [type, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === "opportunity") {
        if (item) await updateOpportunity(password, item.id, formData);
        else await createOpportunity(password, formData);
      }
      if (type === "hackathon") {
        if (item) await updateHackathon(password, item.id, formData);
        else await createHackathon(password, formData);
      }
      if (type === "application") {
        if (item) await updateApplication(password, item.id, formData);
        else await createApplication(password, formData);
      }
      if (type === "event") {
        if (item) await updateEvent(password, item.id, formData);
        else await createEvent(password, formData);
      }
      if (type === "roadmap") {
        if (item) await updateLearningRoadmap(password, item.id, { ...formData, progress: parseInt(formData.progress || "0") });
        else await createLearningRoadmap(password, { ...formData, progress: parseInt(formData.progress || "0") });
      }
      if (type === "goal") {
        if (item) await updateGoal(password, item.id, { ...formData, progress: parseInt(formData.progress || "0") });
        else await createGoal(password, { ...formData, progress: parseInt(formData.progress || "0") });
      }
      if (type === "contact") {
        if (item) await updateContact(password, item.id, formData);
        else await createContact(password, formData);
      }
      if (type === "note") {
        if (item) await updateNote(password, item.id, formData);
        else await createNote(password, formData);
      }
      if (type === "reminder") {
        if (item) await updateReminder(password, item.id, formData);
        else await createReminder(password, formData);
      }
      onSuccess();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 bg-zinc-955/65 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn" onClick={onClose}>
      <div className={`w-full max-w-md border-2 ${theme.border} rounded-xl bg-[#0e0e11] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col`} onClick={(e) => e.stopPropagation()}>
        <header className={`px-6 py-4 border-b-2 ${theme.border} flex justify-between items-center bg-zinc-900/10`}>
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-300">
            {item ? "Configure" : "Define"} {type}
          </h3>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Opportunity fields */}
          {type === "opportunity" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Title</label>
                <input required type="text" value={formData.title || ""} onChange={(e) => handleFieldChange("title", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Company</label>
                <input required type="text" value={formData.company || ""} onChange={(e) => handleFieldChange("company", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Type</label>
                  <select value={formData.type || "INTERNSHIP"} onChange={(e) => handleFieldChange("type", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                    {OPPORTUNITY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Priority</label>
                  <select value={formData.priority || "MEDIUM"} onChange={(e) => handleFieldChange("priority", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Status</label>
                  <select value={formData.status || "DISCOVERED"} onChange={(e) => handleFieldChange("status", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                    {OPPORTUNITY_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Deadline</label>
                  <input type="date" value={formData.deadline || ""} onChange={(e) => handleFieldChange("deadline", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
              </div>
            </>
          )}

          {/* Hackathon fields */}
          {type === "hackathon" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Name</label>
                <input required type="text" value={formData.name || ""} onChange={(e) => handleFieldChange("name", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Organizer</label>
                <input required type="text" value={formData.organizer || ""} onChange={(e) => handleFieldChange("organizer", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Deadline</label>
                  <input type="date" value={formData.deadline || ""} onChange={(e) => handleFieldChange("deadline", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Status</label>
                  <select value={formData.status || "RESEARCHING"} onChange={(e) => handleFieldChange("status", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                    {HACKATHON_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Application fields */}
          {type === "application" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Company</label>
                <input required type="text" value={formData.company || ""} onChange={(e) => handleFieldChange("company", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Role</label>
                <input required type="text" value={formData.role || ""} onChange={(e) => handleFieldChange("role", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Location</label>
                  <input type="text" value={formData.location || ""} onChange={(e) => handleFieldChange("location", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Status</label>
                  <select value={formData.status || "SAVED"} onChange={(e) => handleFieldChange("status", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                    {APPLICATION_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Applied Date</label>
                  <input type="date" value={formData.appliedDate || ""} onChange={(e) => handleFieldChange("appliedDate", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Follow Up Date</label>
                  <input type="date" value={formData.nextFollowUp || ""} onChange={(e) => handleFieldChange("nextFollowUp", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
              </div>
            </>
          )}

          {/* Event fields */}
          {type === "event" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Title</label>
                <input required type="text" value={formData.title || ""} onChange={(e) => handleFieldChange("title", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Category</label>
                  <input required type="text" placeholder="HACKATHON" value={formData.category || "HACKATHON"} onChange={(e) => handleFieldChange("category", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Location</label>
                  <input type="text" placeholder="Online" value={formData.location || ""} onChange={(e) => handleFieldChange("location", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Start Date/Time</label>
                <input required type="datetime-local" value={formData.startDate || ""} onChange={(e) => handleFieldChange("startDate", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
            </>
          )}

          {/* Learning Roadmap fields */}
          {type === "roadmap" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Topic Name</label>
                <input required type="text" placeholder="System Design" value={formData.topic || ""} onChange={(e) => handleFieldChange("topic", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Category</label>
                  <input type="text" placeholder="Backend Development" value={formData.category || ""} onChange={(e) => handleFieldChange("category", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Target Date</label>
                  <input type="date" value={formData.targetDate || ""} onChange={(e) => handleFieldChange("targetDate", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Resources Links</label>
                <textarea rows={2} placeholder="Markdown list of links..." value={formData.resources || ""} onChange={(e) => handleFieldChange("resources", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
            </>
          )}

          {/* Goal fields */}
          {type === "goal" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Title</label>
                <input required type="text" value={formData.title || ""} onChange={(e) => handleFieldChange("title", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Category</label>
                  <select value={formData.category || "WEEKLY"} onChange={(e) => handleFieldChange("category", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                    {GOAL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Status</label>
                  <select value={formData.status || "ACTIVE"} onChange={(e) => handleFieldChange("status", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                    {GOAL_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Networking Contact fields */}
          {type === "contact" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Name</label>
                <input required type="text" value={formData.name || ""} onChange={(e) => handleFieldChange("name", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Email</label>
                <input required type="email" value={formData.email || ""} onChange={(e) => handleFieldChange("email", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Company</label>
                  <input type="text" value={formData.company || ""} onChange={(e) => handleFieldChange("company", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Role</label>
                  <input type="text" value={formData.role || ""} onChange={(e) => handleFieldChange("role", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">LinkedIn Profile URL</label>
                <input type="text" placeholder="https://linkedin.com/in/..." value={formData.linkedin || ""} onChange={(e) => handleFieldChange("linkedin", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Last Contact</label>
                  <input type="date" value={formData.lastContact || ""} onChange={(e) => handleFieldChange("lastContact", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Next Follow-up</label>
                  <input type="date" value={formData.nextFollowUp || ""} onChange={(e) => handleFieldChange("nextFollowUp", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Status</label>
                <select value={formData.status || "NEW"} onChange={(e) => handleFieldChange("status", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="REPLIED">REPLIED</option>
                  <option value="NETWORKING">NETWORKING</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="OPPORTUNITY">OPPORTUNITY</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </>
          )}

          {/* Note fields */}
          {type === "note" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Title</label>
                <input required type="text" value={formData.title || ""} onChange={(e) => handleFieldChange("title", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Tags (comma separated)</label>
                <input type="text" placeholder="ideas, database" value={formData.tags || ""} onChange={(e) => handleFieldChange("tags", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Markdown Content</label>
                <textarea required rows={6} placeholder="# Meeting notes..." value={formData.content || ""} onChange={(e) => handleFieldChange("content", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input} font-mono`} />
              </div>
            </>
          )}

          {/* Reminder fields */}
          {type === "reminder" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Title</label>
                <input required type="text" placeholder="Follow up with Recruiter" value={formData.title || ""} onChange={(e) => handleFieldChange("title", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Message details</label>
                <input type="text" value={formData.message || ""} onChange={(e) => handleFieldChange("message", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Alert Type</label>
                  <select value={formData.type || "BOTH"} onChange={(e) => handleFieldChange("type", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`}>
                    <option value="BOTH">EMAIL + DASHBOARD</option>
                    <option value="EMAIL">EMAIL ONLY</option>
                    <option value="DASHBOARD">DASHBOARD ONLY</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Reminder Date/Time</label>
                  <input required type="datetime-local" value={formData.reminderDate || ""} onChange={(e) => handleFieldChange("reminderDate", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
                </div>
              </div>
            </>
          )}

          {/* Custom Notes text fields across general modals */}
          {type !== "note" && type !== "reminder" && type !== "event" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Private Notes</label>
              <textarea rows={2} value={formData.notes || ""} onChange={(e) => handleFieldChange("notes", e.target.value)} className={`w-full p-2.5 rounded-lg text-xs border ${theme.input}`} />
            </div>
          )}

          <footer className={`pt-4 flex justify-end gap-3 border-t-2 ${theme.border}`}>
            <button type="button" onClick={onClose} className={`px-4 py-2.5 rounded-xl border-2 ${theme.border} ${theme.hover} text-zinc-400 hover:text-zinc-200 text-xs font-bold uppercase transition-all`}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase transition-all">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

