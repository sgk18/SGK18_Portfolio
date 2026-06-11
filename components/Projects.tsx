"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Github, ExternalLink, BookOpen } from "lucide-react";
import CaseStudyModal from "./CaseStudyModal";
import { caseStudies, CaseStudy } from "@/data/caseStudies";
import ScrollReveal from "./ScrollReveal";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageFit?: "cover" | "contain";
  imageBg?: string;
  tags: string[];
  github: string;
  live: string;
  featured?: boolean;
  hasCaseStudy?: boolean;
};

const projects: Project[] = [
  {
    id: "atlas-portfolio",
    title: "Atlas — Personal Portfolio & Career OS",
    description:
      "This site. A full-stack Next.js 16 portfolio with a 12-module career management dashboard (Atlas Console) — recruiter CRM with email threads, opportunity pipeline, job application tracker, hackathon logger, live site analytics, goal tracker, and an automated deadline reminder engine with Resend email delivery.",
    image: "/atlas.png",
    imageFit: "cover",
    tags: ["Next.js 16", "TypeScript", "Prisma", "Turso (LibSQL)", "Resend", "TanStack Query", "Framer Motion"],
    github: "https://github.com/sgk18/SGK18_Portfolio",
    live: "https://suryachalam.vercel.app",
    featured: true,
    hasCaseStudy: true,
  },

  {
    id: "socio-website",
    title: "SOCIO — Official Website",
    description:
      "Full-scale hybrid campus event platform — event discovery, QR ticketing, role-gated dashboards, and push notification infrastructure serving real users at CHRIST University.",
    image: "/socio.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js 15", "Express 5", "Supabase", "Valkey", "PostgreSQL", "Capacitor"],
    github: "https://github.com/sgk18",
    live: "https://socio.christuniversity.in",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "socio-mobile",
    title: "SOCIO Mobile",
    description:
      "Capacitor hybrid Android app spanning 22 routes — offline-first QR scanner with IndexedDB sync, shake-to-scan, VAPID/OneSignal push notifications, and native device integrations.",
    image: "/socio.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js 16", "Capacitor", "IndexedDB", "WebRTC", "OneSignal", "PWA"],
    github: "https://github.com/sgk18/sociomobilev2",
    live: "https://app.withsocio.com",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "facultyapp",
    title: "FacultyApp",
    description:
      "Institutional workflow platform — Flutter + Riverpod mobile app and Next.js web portal with Prisma/Supabase, JWT auth, Google OAuth, Calendar API integrations, FCM, and role-based access.",
    image: "https://placehold.co/600x340/09090e/10b981?text=FacultyApp+Flutter",
    tags: ["Flutter", "Riverpod", "Next.js", "Supabase", "Prisma", "Google APIs"],
    github: "https://github.com/sgk18/Facultyapp",
    live: "https://github.com/sgk18/Facultyapp",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "notenova",
    title: "NoteNova",
    description:
      "Multi-user academic resource sharing with real-time Direct Messaging, AI-powered tools, and a scalable PostgreSQL/Supabase architecture.",
    image: "/notenova.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "AI Integrations"],
    github: "https://github.com/sgk18/NoteNova",
    live: "https://note-nova-khaki.vercel.app",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "cpp",
    title: "Centre for Peace Praxis",
    description:
      "Multi-page institutional site for a university peace research centre — event schedules, alumni directories, faculty database, dashboard with authentication, and full PWA support.",
    image: "/cpp_logo.png",
    imageFit: "contain",
    imageBg: "bg-[#0a1628]",
    tags: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "TypeScript", "PWA"],
    github: "https://github.com/sgk18/Centre-for-Peace-Praxis",
    live: "https://sgk18.github.io/CPP",
  },
  {
    id: "studio-tfa",
    title: "Studio TFA",
    description:
      "Creative studio e-commerce platform — modular frontend architecture, adaptive layouts, built for a freelance client.",
    image: "https://placehold.co/600x340/09090e/ec4899?text=Studio+TFA",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/sgk18/Studio-TFA",
    live: "#",
  },
  {
    id: "aegis",
    title: "Aegis",
    description:
      "Modular productivity platform with a highly scalable frontend architecture and integrated backend database.",
    image: "https://placehold.co/600x340/09090e/3b82f6?text=Aegis+Web",
    tags: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    github: "https://github.com/sgk18/aegis-web",
    live: "#",
  },
  {
    id: "notenova-backend",
    title: "NoteNova Backend",
    description:
      "Backend infrastructure for NoteNova — scalable REST APIs and institutional-scale PostgreSQL with Express.",
    image: "https://placehold.co/600x340/09090e/10b981?text=NoteNova+Backend",
    tags: ["Node.js", "Express", "PostgreSQL", "REST API"],
    github: "https://github.com/sgk18/NoteNova_Backend",
    live: "#",
  },
  {
    id: "arcadia",
    title: "Arcadia RPG",
    description:
      "Fantasy RPG in two layers: native C with custom DSA (linked lists, graphs, priority queues, circular buffers) and Win32 GUI, plus a browser port via Next.js API and HTML5 Canvas renderer.",
    image: "https://placehold.co/600x340/09090e/8b5cf6?text=Arcadia+C+RPG",
    tags: ["C99", "Win32 API", "Next.js", "TypeScript", "HTML5 Canvas"],
    github: "https://github.com/sgk18/Arcadia",
    live: "#",
  },
  {
    id: "techleons",
    title: "Techleons Event Platform",
    description:
      "Immersive Stranger Things-themed event landing page — custom cursor, canvas particle effects, glitch text, flashlight effect, and CRT overlay.",
    image: "https://placehold.co/600x340/09090e/ef4444?text=Techleons+Event+Platform",
    tags: ["Next.js", "TypeScript", "React Context", "Framer Motion", "Tailwind CSS"],
    github: "https://github.com/sgk18/Techleons",
    live: "https://techleons-weld.vercel.app",
  },
];

function trackProjectView(projectId: string) {
  fetch("/api/analytics/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId }),
  }).catch(() => {});
}

export default function Projects() {
  const ref = useRef(null);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <>
      <section id="projects" className="section-padding bg-[#FFF5F5] border-b-2 border-[#0A0A0A]">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-10">
              <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
              <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">PROJECTS</h2>
            </div>
            
            <p className="text-[#3a3a3a] font-medium mt-[-20px] mb-12 max-w-2xl leading-relaxed">
              Featured projects include detailed engineering case studies — click{" "}
              <span className="text-[#E3000F] font-bold">View Case Study</span> to explore architecture decisions, database design, and technical challenges.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project, i) => (
                <article
                  key={project.id}
                  className="bg-white border-2 border-[#0A0A0A] border-t-4 border-t-[#E3000F] 
                             shadow-[6px_6px_0px_#0A0A0A] hover:-translate-x-1 hover:-translate-y-1 
                             hover:shadow-[10px_10px_0px_#0A0A0A] transition-all p-5 flex flex-col gap-4 rounded-none"
                >
                  {/* Project image */}
                  <div className={`relative w-full aspect-video overflow-hidden border-2 border-[#0A0A0A] ${project.imageBg ?? "bg-white"}`}>
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
                    {project.featured && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 border border-[#0A0A0A] bg-[#E3000F] text-white text-[9px] font-bold uppercase tracking-wider shadow-[1.5px_1.5px_0px_#0A0A0A]">
                        Featured
                      </div>
                    )}
                    {project.hasCaseStudy && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 border border-[#0A0A0A] bg-white text-[#0A0A0A] text-[9px] font-bold uppercase tracking-wider shadow-[1.5px_1.5px_0px_#0A0A0A] flex items-center gap-1">
                        <BookOpen size={9} />
                        Case Study
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-lg uppercase text-[#0A0A0A]">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="p-1.5 border-2 border-[#0A0A0A] bg-white hover:bg-[#FFF5F5] shadow-[2px_2px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A0A0A] transition-all rounded-none text-[#0A0A0A]"
                          >
                            <Github size={14} />
                          </a>
                          {project.live !== "#" && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Live site"
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

                      {/* Case Study CTA */}
                      {project.hasCaseStudy && caseStudies[project.id] && (
                        <button
                          id={`case-study-btn-${project.id}`}
                          onClick={() => {
                            setActiveStudy(caseStudies[project.id]);
                            trackProjectView(project.id);
                          }}
                          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#E3000F] hover:underline group/cs cursor-pointer"
                        >
                          <BookOpen size={13} />
                          View Engineering Case Study
                          <span className="group-hover/cs:translate-x-0.5 transition-transform inline-block">→</span>
                        </button>
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
