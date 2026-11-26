"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, BookOpen, ArrowRight } from "lucide-react";
import CaseStudyModal from "../ui/CaseStudyModal";
import { caseStudies, CaseStudy } from "@/data/caseStudies";
import { projects } from "@/data/projects";
import ScrollReveal from "../ui/ScrollReveal";
import { gsap, useGSAP, NB_EASE } from "@/lib/utils/motion";

function trackProjectView(projectId: string) {
  fetch("/api/analytics/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId }),
  }).catch(() => {});
}

export default function Projects() {
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);
  const [showAll, setShowAll] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".project-card-initial", {
          opacity: 0,
          y: 20,
          duration: 0.4,
          stagger: 0.06,
          ease: NB_EASE,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: gridRef }
  );

  useGSAP(
    () => {
      if (!showAll) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".project-card-extra",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: NB_EASE,
            clearProps: "transform,opacity",
          }
        );
      });
    },
    { dependencies: [showAll], scope: gridRef }
  );

  return (
    <>
      <section id="projects" className="section-padding bg-[#FFF5F5] border-b-2 border-[#0A0A0A]">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
                <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">
                  PROJECTS
                </h2>
              </div>

              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 border-2 border-[#0A0A0A] bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#E3000F] hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all self-start sm:self-auto"
              >
                <span>All Projects &amp; Filters</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <p className="text-[#3a3a3a] font-medium -mt-4 mb-12 max-w-2xl leading-relaxed">
              Featured projects include detailed engineering case studies — open a{" "}
              <span className="text-[#E3000F] font-bold">Case Study</span> to explore
              architecture decisions, database design, and technical challenges.
            </p>

            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project, idx) => (
                <article
                  key={project.id}
                  className={`${
                    idx < 6 ? "project-card-initial" : "project-card-extra"
                  } bg-white border-2 border-[#0A0A0A] border-t-4 border-t-[#E3000F]
                             shadow-[6px_6px_0px_#0A0A0A] hover:-translate-x-1 hover:-translate-y-1
                             hover:shadow-[10px_10px_0px_#0A0A0A] transition-all p-5 flex flex-col gap-4 rounded-none`}
                >
                  {/* Project visual */}
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
                        className={`${
                          project.imageFit === "contain"
                            ? "object-contain p-4"
                            : "object-cover object-top"
                        } transition-all duration-300`}
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

                    {project.featured && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 border border-[#0A0A0A] bg-[#E3000F] text-white text-[9px] font-bold uppercase tracking-wider shadow-[1.5px_1.5px_0px_#0A0A0A]">
                        Featured
                      </div>
                    )}
                    {project.hasCaseStudy && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 border border-[#0A0A0A] bg-white text-[#0A0A0A] text-[9px] font-bold uppercase tracking-wider shadow-[1.5px_1.5px_0px_#0A0A0A] flex items-center gap-1">
                        <BookOpen size={9} aria-hidden="true" />
                        Case Study
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-lg uppercase text-[#0A0A0A]">
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
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} GitHub`}
                            className="p-1.5 border-2 border-[#0A0A0A] bg-white hover:bg-[#FFF5F5] shadow-[2px_2px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A0A0A] transition-all rounded-none text-[#0A0A0A]"
                          >
                            <Github size={14} />
                          </a>
                          {project.live !== "#" && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${project.title} live site`}
                              className="p-1.5 border-2 border-[#0A0A0A] bg-[#E3000F] text-white hover:bg-[#FF1A1A] shadow-[2px_2px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A0A0A] transition-all rounded-none"
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
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] px-2 py-0.5
                                       font-mono text-xs font-bold shadow-[1.5px_1.5px_0px_#0A0A0A]
                                       hover:bg-[#E3000F] hover:text-white hover:-translate-x-0.5
                                       hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_#0A0A0A]
                                       transition-all cursor-default rounded-none inline-block"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Case Study Actions */}
                      {project.hasCaseStudy && caseStudies[project.id] && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <Link
                            href={`/projects/${project.id}`}
                            onClick={() => trackProjectView(project.id)}
                            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#E3000F] hover:underline group/cs"
                          >
                            <BookOpen size={13} aria-hidden="true" />
                            <span>Read Case Study</span>
                            <span className="group-hover/cs:translate-x-0.5 transition-transform inline-block">
                              →
                            </span>
                          </Link>

                          <button
                            type="button"
                            id={`case-study-btn-${project.id}`}
                            onClick={() => {
                              setActiveStudy(caseStudies[project.id]);
                              trackProjectView(project.id);
                            }}
                            className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0A0A0A] underline decoration-[#0A0A0A] underline-offset-2 hover:text-[#E3000F] hover:decoration-[#E3000F] cursor-pointer"
                          >
                            Quick View
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Show more/less */}
            <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              {!showAll && projects.length > 6 && (
                <button
                  type="button"
                  id="show-more-projects-btn"
                  onClick={() => setShowAll(true)}
                  className="bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFF5F5] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#0A0A0A] rounded-none transition-all cursor-pointer text-sm"
                >
                  Show All Projects ({projects.length - 6} more)
                </button>
              )}
              <a
                href="https://github.com/sgk18"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFF5F5] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#0A0A0A] rounded-none transition-all text-sm flex items-center justify-center gap-2"
              >
                <Github size={16} />
                View more on GitHub
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <CaseStudyModal study={activeStudy} onClose={() => setActiveStudy(null)} />
    </>
  );
}
