"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  Github,
  Star,
  GitFork,
  Users,
  BookOpen,
  ExternalLink,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { GitHubData } from "@/app/api/github/route";

// ─── Language colour map ─────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
  Shell: "#89e051",
  Swift: "#f05138",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Other: "#8b8b8b",
};

function langColor(name: string): string {
  return LANG_COLORS[name] ?? LANG_COLORS["Other"];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card-bg rounded-2xl p-5 flex flex-col gap-2">
      <div className="text-indigo-400">{icon}</div>
      <p className="text-2xl font-bold text-slate-100">{value.toLocaleString()}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card-bg rounded-2xl p-5 animate-pulse space-y-3">
      <div className="w-6 h-6 bg-slate-800 rounded" />
      <div className="w-16 h-6 bg-slate-800 rounded" />
      <div className="w-24 h-3 bg-slate-800 rounded" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GitHubStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [data, setData] = useState<GitHubData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error ?? "Failed to load");
        setData(json as GitHubData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="github" className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">
            05. Open Source
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            GitHub{" "}
            <span className="gradient-text">presence</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
            Live data fetched directly from GitHub — repositories, language distribution, and activity.
          </p>
        </motion.div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-start gap-3 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm mb-10">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>
              Could not load GitHub data: {error}. If you are running locally without a{" "}
              <code>GITHUB_TOKEN</code>, you may be hitting rate limits.
            </span>
          </div>
        )}

        {/* Profile Card + Metrics */}
        <div className="grid lg:grid-cols-12 gap-6 mb-10">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 card-bg rounded-2xl p-6 flex flex-col gap-5"
          >
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-800" />
                <div className="w-32 h-5 bg-slate-800 rounded" />
                <div className="w-48 h-3 bg-slate-800 rounded" />
                <div className="w-40 h-3 bg-slate-800 rounded" />
              </div>
            ) : data ? (
              <>
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500/30">
                  <Image
                    src={data.avatarUrl}
                    alt={data.username}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-100">{data.name ?? data.username}</p>
                  <p className="text-sm font-mono text-indigo-400">@{data.username}</p>
                  {data.bio && (
                    <p className="text-sm text-slate-400 leading-relaxed mt-2">{data.bio}</p>
                  )}
                </div>
                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <Github size={14} />
                  View GitHub Profile
                  <ExternalLink size={12} />
                </a>
              </>
            ) : null}
          </motion.div>

          {/* Metric cards */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4 content-start">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : data ? (
              <>
                <MetricCard label="Repositories" value={data.publicRepos} icon={<BookOpen size={18} />} />
                <MetricCard label="Stars earned" value={data.totalStars} icon={<Star size={18} />} />
                <MetricCard label="Forks" value={data.totalForks} icon={<GitFork size={18} />} />
                <MetricCard label="Followers" value={data.followers} icon={<Users size={18} />} />
              </>
            ) : null}
          </div>
        </div>

        {/* Language Breakdown */}
        {(loading || data) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-bg rounded-2xl p-6 mb-6"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
              Language Breakdown
            </h3>
            {loading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 h-3 bg-slate-800 rounded" />
                    <div className="flex-1 h-2 bg-slate-800 rounded-full" />
                    <div className="w-8 h-3 bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : data ? (
              <>
                {/* Stacked bar */}
                <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
                  {data.languageBreakdown.map((lang) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: langColor(lang.name),
                      }}
                      title={`${lang.name} — ${lang.percentage}%`}
                    />
                  ))}
                </div>
                {/* Legend */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {data.languageBreakdown.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: langColor(lang.name) }}
                      />
                      <span className="text-sm text-slate-300 truncate">{lang.name}</span>
                      <span className="text-xs text-slate-500 ml-auto shrink-0">{lang.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Repositories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-bg rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
              Featured Repositories
            </h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b border-slate-800">
                    <div className="w-32 h-4 bg-slate-800 rounded" />
                    <div className="w-48 h-3 bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : data ? (
              <div className="space-y-4">
                {data.topRepos.map((repo, i) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col gap-1.5 pb-4 transition-opacity hover:opacity-100 ${i < data.topRepos.length - 1 ? "border-b border-slate-800" : ""} opacity-90`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors font-mono">
                        {repo.name}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                        {repo.stars > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={11} />
                            {repo.stars}
                          </span>
                        )}
                        {repo.forks > 0 && (
                          <span className="flex items-center gap-1">
                            <GitFork size={11} />
                            {repo.forks}
                          </span>
                        )}
                      </div>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: langColor(repo.language) }}
                        />
                        <span className="text-xs text-slate-500">{repo.language}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            ) : null}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="card-bg rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
              Recent Activity
            </h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="w-32 h-4 bg-slate-800 rounded" />
                    <div className="w-16 h-3 bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : data ? (
              <div className="space-y-3">
                {data.recentRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 border-b border-slate-800/60 last:border-0 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: langColor(repo.language) }}
                        />
                      )}
                      <span className="text-sm font-mono text-slate-300 group-hover:text-indigo-300 transition-colors">
                        {repo.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                      <Clock size={11} />
                      {timeAgo(repo.updatedAt)}
                    </div>
                  </a>
                ))}

                <a
                  href={`https://github.com/${data.username}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors pt-2"
                >
                  <Github size={12} />
                  View all {data.publicRepos} repositories →
                </a>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
