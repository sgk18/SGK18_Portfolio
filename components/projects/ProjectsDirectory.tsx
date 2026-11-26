"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ExternalLink, Github, Search, X } from "lucide-react";
import type { Project, ProjectCategory } from "@/data/projects";
import { caseStudies } from "@/data/caseStudies";
import { gsap, useGSAP, NB_EASE } from "@/lib/utils/motion";

interface ProjectsDirectoryProps {
  readonly projects: readonly Project[];
}

const CATEGORIES: readonly ("All" | ProjectCategory)[] = [
  "All",
  "Full-Stack",
  "Mobile & PWA",
  "Frontend",
  "Systems & Graphics",
  "Research",
];

function trackProjectView(projectId: string) {
  fetch("/api/analytics/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId }),
  }).catch(() => {});
}

export default function ProjectsDirectory({ projects }: ProjectsDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProjectCategory>("All");
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (selectedCategory !== "All" && project.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [projects, selectedCategory, query]);

  useGSAP(
    () => {
      if (filtered.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".directory-card",
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            stagger: 0.035,
            ease: NB_EASE,
            clearProps: "transform,opacity",
          }
        );
      });
    },
    { dependencies: [selectedCategory, query], scope: gridRef }
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-[#0A0A0A]">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 border-2 border-[#0A0A0A] font-mono text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                  active
                    ? "bg-[#E3000F] text-white shadow-[3px_3px_0px_#0A0A0A]"
                    : "bg-white text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#FFF5F5]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A0A0A] pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name or tech..."
            aria-label="Search projects by name or technology"
            className="w-full pl-9 pr-8 py-2 border-2 border-[#0A0A0A] bg-white text-sm font-medium text-[#0A0A0A] placeholder:text-[#666666] shadow-[2px_2px_0px_#0A0A0A] focus:outline-none focus:border-[#E3000F] rounded-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0A0A0A] hover:text-[#E3000F] cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-[#0A0A0A] bg-white p-10 text-center shadow-[5px_5px_0px_#0A0A0A] space-y-3 rounded-none">
          <p className="font-black text-xl uppercase text-[#0A0A0A]">
            No matching projects found
          </p>
          <p className="text-sm text-[#3a3a3a] font-medium">
            Try clearing your search or switching back to all categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setQuery("");
            }}
            className="mt-2 inline-flex items-center px-5 py-2.5 border-2 border-[#0A0A0A] bg-[#E3000F] text-white font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FF1A1A] cursor-pointer rounded-none"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="directory-card bg-white border-2 border-[#0A0A0A] border-t-4 border-t-[#E3000F]
                         shadow-[6px_6px_0px_#0A0A0A] hover:-translate-x-1 hover:-translate-y-1
                         hover:shadow-[10px_10px_0px_#0A0A0A] transition-all p-5 flex flex-col gap-4 rounded-none"
            >
              <div
                className={`relative w-full aspect-video overflow-hidden border-2 border-[#0A0A0A] ${
                  project.imageBg ?? "bg-[#0A0A0A]"
                }`}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={
                      project.imageFit === "contain"
                        ? "object-contain p-4"
                        : "object-cover object-top"
                    }
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={90}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#0A0A0A] text-white">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#E3000F] font-bold mb-1">
                      {project.category}
                    </span>
                    <span className="font-black text-xl uppercase tracking-tight">
                      {project.previewLabel ?? project.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-black text-lg uppercase text-[#0A0A0A]">
                      {project.hasCaseStudy && caseStudies[project.id] ? (
                        <Link
                          href={`/projects/${project.id}`}
                          onClick={() => trackProjectView(project.id)}
                          className="hover:text-[#E3000F] transition-colors"
                        >
                          {project.title}
                        </Link>
                      ) : (
                        project.title
                      )}
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} GitHub`}
                        className="p-1.5 border-2 border-[#0A0A0A] bg-white hover:bg-[#FFF5F5] shadow-[2px_2px_0px_#0A0A0A] transition-all rounded-none text-[#0A0A0A]"
                      >
                        <Github size={14} />
                      </a>
                      {project.live !== "#" && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live site`}
                          className="p-1.5 border-2 border-[#0A0A0A] bg-[#E3000F] text-white hover:bg-[#FF1A1A] shadow-[2px_2px_0px_#0A0A0A] transition-all rounded-none"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="font-medium text-sm text-[#3a3a3a] leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] px-2 py-0.5 font-mono text-xs font-bold shadow-[1.5px_1.5px_0px_#0A0A0A] rounded-none inline-block"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.hasCaseStudy && caseStudies[project.id] && (
                    <Link
                      href={`/projects/${project.id}`}
                      onClick={() => trackProjectView(project.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#E3000F] hover:underline group/cs"
                    >
                      <BookOpen size={13} aria-hidden="true" />
                      <span>Read Case Study</span>
                      <span className="group-hover/cs:translate-x-0.5 transition-transform inline-block">
                        →
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
