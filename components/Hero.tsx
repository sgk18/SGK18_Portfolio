"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download, ArrowRight } from "lucide-react";
import Hyperspeed from "./Hyperspeed";
import { smoothScrollTo } from "@/lib/smoothScroll";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const hyperspeedOptions = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5] as [number, number],
  lightStickHeight: [1.3, 1.7] as [number, number],
  movingAwaySpeed: [60, 80] as [number, number],
  movingCloserSpeed: [-120, -160] as [number, number],
  carLightsLength: [400 * 0.03, 400 * 0.2] as [number, number],
  carLightsRadius: [0.05, 0.14] as [number, number],
  carWidthPercentage: [0.3, 0.5] as [number, number],
  carShiftX: [-0.8, 0.8] as [number, number],
  carFloorSeparation: [0, 5] as [number, number],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0x131318,
    brokenLines: 0x131318,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3,
  },
};

const focusAreas = [
  "Full Stack Engineering",
  "Offline-First Systems",
  "Database Architecture",
  "Push Infrastructure",
  "Product Engineering",
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/sgk18",
    icon: <Github size={16} />,
    id: "hero-github-link",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/suryachalam",
    icon: <Linkedin size={16} />,
    id: "hero-linkedin-link",
  },
  {
    label: "Email",
    href: "mailto:suryachalam18@gmail.com",
    icon: <Mail size={16} />,
    id: "hero-email-link",
  },
];

export default function Hero() {
  const effectOptions = useMemo(() => hyperspeedOptions, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Hyperspeed WebGL background */}
      <div className="absolute inset-0">
        <Hyperspeed effectOptions={effectOptions} />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Status badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-slate-700/60 text-slate-400 text-xs font-mono mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          Product Engineering Intern @ SOCIO · Bengaluru, India
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 leading-[1.08]"
        >
          <span className="text-slate-100">Suryachalam V M</span>
        </motion.h1>

        {/* Engineering positioning */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-xl md:text-2xl font-semibold tracking-wide gradient-text mb-5"
        >
          Product Engineer · Full-Stack · Systems Builder
        </motion.p>

        {/* Impact statement */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          I build production systems — not tutorial projects. Offline-first mobile, caching layers,
          push infrastructure, and role-based platforms that hold up under load.
          Currently shipping real features for real users at{" "}
          <span className="text-slate-200 font-medium">SOCIO</span>.
        </motion.p>

        {/* Focus Areas */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {focusAreas.map((area) => (
            <span
              key={area}
              className="px-3 py-1.5 text-xs font-mono rounded-full bg-slate-900/70 backdrop-blur-sm border border-slate-700/60 text-slate-400"
            >
              {area}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
        >
          <button
            id="hero-view-work-btn"
            onClick={() => smoothScrollTo("#projects")}
            className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            View Projects & Case Studies
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            id="hero-resume-download-btn"
            href="/resume.pdf"
            download="Suryachalam_VM_Resume.pdf"
            onClick={() => fetch('/api/analytics/download', { method: 'POST' }).catch(() => {})}
            className="group flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700/60 bg-black/30 backdrop-blur-sm text-slate-300 font-semibold text-sm hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Download size={15} />
            Download Resume
          </a>
          <button
            id="hero-contact-btn"
            onClick={() => smoothScrollTo("#contact")}
            className="group flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700/60 bg-black/30 backdrop-blur-sm text-slate-300 font-semibold text-sm hover:border-slate-500/60 hover:text-slate-100 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Mail size={15} />
            Get in Touch
          </button>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={6}
          className="flex items-center justify-center gap-4"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              id={s.id}
              href={s.href}
              target={s.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-200 text-sm transition-colors duration-200"
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
