"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";

type Project = {
  title: string;
  description: string;
  image: string;
  imageFit?: "cover" | "contain";
  imageBg?: string;
  tags: string[];
  github: string;
  live: string;
  featured?: boolean;
};

const projects: Project[] = [
  {
    title: "SOCIO — Official Website",
    description:
      "A comprehensive university event and operations platform for Christ University. Covers public event discovery, organizer tools, individual/team registrations, automated QR ticketing, attendance tracking, and 9+ role-gated operational workflows (HOD, Dean, CFO, Volunteer, Catering, and Venue dashboards). Built as a monorepo.",
    image: "/socio.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js 15", "Express 5", "Supabase", "PostgreSQL", "React 19", "Tailwind CSS 4"],
    github: "https://github.com/sgk18",
    live: "https://socio.christuniversity.in",
    featured: true,
  },
  {
    title: "SOCIO Mobile",
    description:
      "A Next.js 16 + Capacitor hybrid app spanning 22 routes. Features student portals, role-gated volunteer and catering dashboards, offline ticket caching via IndexedDB, shake-to-scan accelerometer binding, a WebRTC QR scanner, VAPID/OneSignal push notifications, and native device camera/torch integrations.",
    image: "/socio.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js 16", "Capacitor", "IndexedDB", "WebRTC", "OneSignal", "PWA"],
    github: "https://github.com/sgk18/sociomobilev2",
    live: "https://app.withsocio.com",
    featured: true,
  },
  {
    title: "FacultyApp — Institutional Workflow",
    description:
      "A full-stack workflow management platform featuring a Flutter + Riverpod/GoRouter mobile app and a Next.js web portal. Integrates Prisma and Supabase with JWT auth, Google OAuth, Gmail/Calendar API integrations, FCM push notifications, Resend email, and role-based ADMIN/HOD/FACULTY access control.",
    image: "https://placehold.co/600x340/09090e/10b981?text=FacultyApp+Flutter",
    tags: ["Flutter", "Riverpod", "Next.js", "Supabase", "Prisma", "Google APIs"],
    github: "https://github.com/sgk18/Facultyapp",
    live: "https://github.com/sgk18/Facultyapp",
    featured: true,
  },
  {
    title: "NoteNova",
    description:
      "A multi-user academic resource-sharing platform featuring real-time Direct Messaging, AI-powered learning tools, secure user authentication, and a highly scalable PostgreSQL/Supabase database architecture.",
    image: "/notenova.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "AI Integrations", "Tailwind CSS"],
    github: "https://github.com/sgk18/NoteNova",
    live: "https://note-nova-khaki.vercel.app",
    featured: true,
  },
  {
    title: "Centre for Peace Praxis",
    description:
      "A multi-page web application for a university peace research centre — featuring event schedules, alumni directories, faculty databases, a secure dashboard with authentication, and image galleries. Built with static HTML/CSS/JS, Tailwind CSS, and full PWA support.",
    image: "/cpp_logo.png",
    imageFit: "contain",
    imageBg: "bg-[#0a1628]",
    tags: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "TypeScript", "PWA"],
    github: "https://github.com/sgk18/Centre-for-Peace-Praxis",
    live: "https://sgk18.github.io/CPP",
  },
  {
    title: "Arcadia RPG",
    description:
      "A fantasy RPG built in two layers: a native C version using custom DSA (linked lists, graphs, priority queues, circular buffers) with a Win32 GUI, and a browser port powered by a Next.js API and HTML5 Canvas renderer with sprite animations.",
    image: "https://placehold.co/600x340/09090e/8b5cf6?text=Arcadia+C+RPG",
    tags: ["C99", "Win32 API", "Next.js", "TypeScript", "HTML5 Canvas"],
    github: "https://github.com/sgk18/Arcadia",
    live: "#",
  },
  {
    title: "Techleons Event Platform",
    description:
      "A visually immersive event landing page with a Stranger Things theme. Features custom cursor tracking using React Context, canvas particle backgrounds, glitch text, flashlight effect, and a CRT retro overlay.",
    image: "https://placehold.co/600x340/09090e/ef4444?text=Techleons+Event+Platform",
    tags: ["Next.js", "TypeScript", "React Context", "Framer Motion", "Tailwind CSS"],
    github: "https://github.com/sgk18/Techleons",
    live: "https://techleons-weld.vercel.app",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="section-padding bg-[var(--card)]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">03. Projects</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Things I&apos;ve{" "}
            <span className="gradient-text">built</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
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
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
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
  );
}
