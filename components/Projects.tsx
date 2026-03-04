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
    title: "NoteNova",
    description:
      "A campus resource sharing platform with a real-time Direct Messaging system and AI-powered learning tools. Built with a scalable backend and user authentication using MongoDB and Supabase.",
    image: "/notenova.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js", "TypeScript", "MongoDB", "Supabase", "REST APIs", "Tailwind CSS"],
    github: "https://github.com/sgk18/NoteNova",
    live: "https://note-nova-khaki.vercel.app",
    featured: true,
  },
  {
    title: "Centre for Peace Praxis",
    description:
      "A multi-page web application for a peace research centre — featuring event pages, alumni records, faculty profiles, a dashboard with auth, and a gallery. Built with static HTML/CSS/JS, Tailwind CSS, and PWA support via a web manifest.",
    image: "/cpp_logo.png",
    imageFit: "contain",
    imageBg: "bg-[#0a1628]",
    tags: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "TypeScript", "PWA", "PostCSS"],
    github: "https://github.com/sgk18/Centre-for-Peace-Praxis",
    live: "https://sgk18.github.io/CPP",
    featured: true,
  },
  {
    title: "Arcadia",
    description:
      "A fantasy RPG built across two parallel layers: a native C game (terminal CLI + Win32 GUI) using custom DSA — linked lists, graphs, priority queues, and circular buffers — and a browser port powered by a stateless Next.js API + HTML5 Canvas renderer with sprite animations for real-time 2D combat.",
    image: "https://placehold.co/600x340/0d0d1a/7c3aed?text=Arcadia+RPG",
    tags: ["C99", "Win32 API", "Next.js", "TypeScript", "HTML5 Canvas", "REST API", "Tailwind CSS"],
    github: "https://github.com/sgk18/Arcadia",
    live: "#",
    featured: true,
  },
  {
    title: "Techleons",
    description:
      "A visually immersive Next.js event platform with a Stranger Things-inspired theme — featuring custom cursor tracking via React Context, particle backgrounds, glitch text, flashlight effects, and a retro overlay, all driven by modular TypeScript components.",
    image: "https://placehold.co/600x340/0d0d0d/ef4444?text=Techleons",
    tags: ["Next.js", "TypeScript", "React Context", "Tailwind CSS", "PostCSS"],
    github: "https://github.com/sgk18/Techleons",
    live: "https://techleons-weld.vercel.app",
    featured: true,
  },
  {
    title: "BottleStory",
    description:
      "A modern Next.js 13+ web app built with the App Router, TypeScript, and CSS Modules. Follows clean architecture with a root layout, scoped page styles, and static asset management — structured for scalability and fast iteration.",
    image: "https://placehold.co/600x340/0f1a2e/06b6d4?text=BottleStory",
    tags: ["Next.js", "TypeScript", "CSS Modules", "App Router", "ESLint"],
    github: "https://github.com/sgk18/BottleStory",
    live: "https://bottle-story-cww1.vercel.app",
  },
  {
    title: "GreenCart",
    description:
      "An e-commerce web application with a clean, responsive UI for browsing and purchasing products. Built and deployed on Vercel with a focus on smooth shopping UX.",
    image: "/greencart.png",
    imageFit: "contain",
    imageBg: "bg-white",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    github: "https://github.com/sgk18",
    live: "https://green-cart-ten-kappa.vercel.app",
  },
  {
    title: "Portfolio Website",
    description:
      "Personal portfolio showcasing frontend projects, 3D elements via Three.js, and technical skills. Built with Next.js, TypeScript, and Framer Motion with a focus on performance and visual polish.",
    image: "/logo.png",
    imageFit: "contain",
    imageBg: "bg-black",
    tags: ["Next.js", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
    github: "https://github.com/sgk18",
    live: "https://sgk-18-portfolio.vercel.app",
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
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Live site"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
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
