"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Github, ExternalLink, BookOpen } from "lucide-react";
import CaseStudyModal from "./CaseStudyModal";
import { caseStudies, CaseStudy } from "@/data/caseStudies";

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
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <>
      <section id="projects" className="section-padding bg-[var(--card)]/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-indigo-400 font-mono text-sm font-medium mb-2">04. Projects</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
              Things I&apos;ve{" "}
              <span className="gradient-text">built</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
              Featured projects include detailed engineering case studies — click{" "}
              <span className="text-indigo-400">View Case Study</span> to explore architecture decisions, database design, and technical challenges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {visibleProjects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                className="card-bg rounded-2xl overflow-hidden group hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Project image */}
                <div className={`relative w-full aspect-video overflow-hidden ${project.imageBg ?? "bg-[var(--card)]"}`}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`${
                      project.imageFit === "contain"
                        ? "object-contain p-6"
                        : "object-cover object-top group-hover:scale-105"
                    } opacity-80 group-hover:opacity-100 transition-all duration-500`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                  />
                  {project.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-indigo-500/80 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider border border-indigo-400/30">
                      Featured
                    </div>
                  )}
                  {project.hasCaseStudy && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-indigo-300 text-[10px] font-semibold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1">
                      <BookOpen size={9} />
                      Case Study
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
                      >
                        <Github size={16} />
                      </a>
                      {project.live !== "#" && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live site"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
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
                      className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/cs"
                    >
                      <BookOpen size={13} />
                      View Engineering Case Study
                      <span className="group-hover/cs:translate-x-0.5 transition-transform inline-block">→</span>
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {/* Show more/less */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            {!showAll && projects.length > 6 && (
              <button
                id="show-more-projects-btn"
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-slate-400 text-sm font-medium hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all duration-200"
              >
                Show All Projects ({projects.length - 6} more)
              </button>
            )}
            <a
              href="https://github.com/sgk18"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-slate-400 text-sm font-medium hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all duration-200"
            >
              <Github size={16} />
              View more on GitHub
            </a>
          </motion.div>
        </div>
      </section>

      <CaseStudyModal study={activeStudy} onClose={() => setActiveStudy(null)} />
    </>
  );
}
