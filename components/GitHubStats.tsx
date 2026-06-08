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
import ScrollReveal from "./ScrollReveal";

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
    <div className="border-2 border-[#0A0A0A] bg-white p-5 flex flex-col gap-2 shadow-[3px_3px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all rounded-none">
      <div className="text-[#E3000F]">{icon}</div>
      <p className="text-2xl font-black text-[#0A0A0A] font-mono">{value.toLocaleString()}</p>
      <p className="text-xs uppercase font-bold text-[#666666] tracking-wider">{label}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border-2 border-[#0A0A0A] bg-white p-5 animate-pulse space-y-3 rounded-none shadow-[3px_3px_0px_#0A0A0A]">
      <div className="w-6 h-6 bg-gray-200" />
      <div className="w-16 h-6 bg-gray-200" />
      <div className="w-24 h-3 bg-gray-200" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GitHubStats() {
  const ref = useRef(null);

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
    <section id="github" className="section-padding bg-white border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">GITHUB STATS</h2>
          </div>
          
          <p className="text-[#3a3a3a] font-medium mt-[-20px] mb-12 max-w-2xl leading-relaxed">
            Live data fetched directly from GitHub — repositories, language distribution, and activity.
          </p>

          {/* Error state */}
          {error && !loading && (
            <div className="flex items-start gap-3 p-4 border-2 border-[#0A0A0A] bg-[#FFF5F5] text-[#0A0A0A] font-bold text-sm mb-10 rounded-none shadow-[3px_3px_0px_#0A0A0A]">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-[#E3000F]" />
              <span>
                Could not load GitHub data: {error}. If you are running locally without a{" "}
                <code>GITHUB_TOKEN</code>, you may be hitting rate limits.
              </span>
            </div>
          )}

          {/* Profile Card + Metrics */}
          <div className="grid lg:grid-cols-12 gap-6 mb-10">
            {/* Profile */}
            <div className="lg:col-span-4 border-2 border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#0A0A0A] transition-all rounded-none flex flex-col gap-5">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="w-20 h-20 rounded-none bg-gray-200 border-2 border-[#0A0A0A]" />
                  <div className="w-32 h-5 bg-gray-200" />
                  <div className="w-48 h-3 bg-gray-200" />
                  <div className="w-40 h-3 bg-gray-200" />
                </div>
              ) : data ? (
                <>
                  <div className="relative w-20 h-20 rounded-none overflow-hidden border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                    <Image
                      src={data.avatarUrl}
                      alt={data.username}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-black uppercase text-[#0A0A0A]">{data.name ?? data.username}</p>
                    <p className="text-sm font-mono text-[#E3000F] font-bold">@{data.username}</p>
                    {data.bio && (
                      <p className="text-sm text-[#3a3a3a] font-medium leading-relaxed mt-2">{data.bio}</p>
                    )}
                  </div>
                  <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0A0A0A] hover:underline"
                  >
                    <Github size={14} />
                    View GitHub Profile
                    <ExternalLink size={12} />
                  </a>
                </>
              ) : null}
            </div>

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
            <div className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_#0A0A0A] rounded-none mb-6">
              <h3 className="text-xs font-black uppercase text-[#E3000F] tracking-widest mb-5">
                Language Breakdown
              </h3>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-20 h-3 bg-gray-200" />
                      <div className="flex-1 h-3 bg-gray-200" />
                      <div className="w-8 h-3 bg-gray-200" />
                    </div>
                  ))}
                </div>
              ) : data ? (
                <>
                  {/* Stacked bar */}
                  <div className="flex h-4 border-2 border-[#0A0A0A] overflow-hidden mb-6 gap-0.5 rounded-none">
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
                      <div key={lang.name} className="flex items-center gap-2.5 p-2 border-2 border-[#0A0A0A] bg-white shadow-[2px_2px_0px_#0A0A0A] rounded-none">
                        <span
                          className="w-2.5 h-2.5 border border-[#0A0A0A] shrink-0"
                          style={{ backgroundColor: langColor(lang.name) }}
                        />
                        <span className="text-xs font-mono font-bold text-[#0A0A0A] truncate">{lang.name}</span>
                        <span className="text-xs font-mono font-bold text-[#666666] ml-auto shrink-0">{lang.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Repositories */}
            <div className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_#0A0A0A] rounded-none">
              <h3 className="text-xs font-black uppercase text-[#E3000F] tracking-widest mb-5">
                Featured Repositories
              </h3>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2 pb-4 border-b-2 border-gray-100">
                      <div className="w-32 h-4 bg-gray-200" />
                      <div className="w-48 h-3 bg-gray-200" />
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
                      className={`group flex flex-col gap-1.5 pb-4 transition-all hover:-translate-x-0.5 hover:opacity-100 ${i < data.topRepos.length - 1 ? "border-b-2 border-dashed border-gray-100" : ""} opacity-90`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black uppercase text-[#0A0A0A] group-hover:text-[#E3000F] transition-colors font-mono">
                          {repo.name}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-mono text-[#666666] shrink-0 font-bold">
                          {repo.stars > 0 && (
                            <span className="flex items-center gap-1 border border-[#0A0A0A] px-1 bg-[#FFF5F5]">
                              <Star size={11} className="text-[#E3000F]" />
                              {repo.stars}
                            </span>
                          )}
                          {repo.forks > 0 && (
                            <span className="flex items-center gap-1 border border-[#0A0A0A] px-1 bg-[#FFF5F5]">
                              <GitFork size={11} className="text-[#0A0A0A]" />
                              {repo.forks}
                            </span>
                          )}
                        </div>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-[#3a3a3a] font-medium leading-relaxed line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      {repo.language && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className="w-2 h-2 border border-[#0A0A0A]"
                            style={{ backgroundColor: langColor(repo.language) }}
                          />
                          <span className="text-[10px] font-mono font-bold text-[#666666] uppercase">{repo.language}</span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Recent Activity */}
            <div className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_#0A0A0A] rounded-none">
              <h3 className="text-xs font-black uppercase text-[#E3000F] tracking-widest mb-5">
                Recent Activity
              </h3>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="w-32 h-4 bg-gray-200" />
                      <div className="w-16 h-3 bg-gray-200" />
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
                      className="group flex items-center justify-between py-2.5 border-b border-dashed border-gray-100 last:border-0 hover:translate-x-0.5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {repo.language && (
                          <span
                            className="w-2.5 h-2.5 border border-[#0A0A0A] shrink-0"
                            style={{ backgroundColor: langColor(repo.language) }}
                          />
                        )}
                        <span className="text-sm font-mono font-bold text-[#0A0A0A] group-hover:text-[#E3000F] transition-colors">
                          {repo.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#666666] font-mono font-bold shrink-0">
                        <Clock size={11} />
                        {timeAgo(repo.updatedAt)}
                      </div>
                    </a>
                  ))}

                  <a
                    href={`https://github.com/${data.username}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#E3000F] hover:underline pt-2 cursor-pointer"
                  >
                    <Github size={12} />
                    View all {data.publicRepos} repositories →
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
