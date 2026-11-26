"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { createTimer, type Timer } from "animejs";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";
import { prefersReducedMotion } from "@/lib/utils/motion";

const Hyperspeed = dynamic(() => import("../ui/Hyperspeed"), {
  ssr: false,
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const hyperspeedOptions = {
  distortion: "turbulentDistortion",
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
] as const;

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/sgk18",
    icon: <Github size={15} aria-hidden="true" />,
    id: "hero-github-link",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/suryachalam",
    icon: <Linkedin size={15} aria-hidden="true" />,
    id: "hero-linkedin-link",
  },
  {
    label: "Email",
    href: "mailto:suryachalam18@gmail.com",
    icon: <Mail size={15} aria-hidden="true" />,
    id: "hero-email-link",
  },
] as const;

export default function Hero() {
  const effectOptions = useMemo(() => hyperspeedOptions, []);
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<Timer | null>(null);
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const timer = createTimer({
      duration: 2800,
      loop: true,
      autoplay: false,
      onUpdate: (self) => {
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${self.iterationProgress})`;
        }
      },
      onLoop: () => {
        setActiveFocusIndex((prev) => (prev + 1) % focusAreas.length);
      },
    });

    timerRef.current = timer;

    const syncPlayback = () => {
      if (!timerRef.current) return;
      const shouldRun =
        isVisibleRef.current &&
        !isHoveredRef.current &&
        document.visibilityState === "visible";
      if (shouldRun) {
        timerRef.current.play();
      } else {
        timerRef.current.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      timer.cancel();
      timerRef.current = null;
    };
  }, []);

  const handleFocusPause = () => {
    isHoveredRef.current = true;
    timerRef.current?.pause();
  };

  const handleFocusResume = () => {
    isHoveredRef.current = false;
    if (isVisibleRef.current && document.visibilityState === "visible") {
      timerRef.current?.play();
    }
  };

  const handleFocusSelect = (idx: number) => {
    setActiveFocusIndex(idx);
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = "scaleX(0)";
    }
    timerRef.current?.restart();
    if (isHoveredRef.current) {
      timerRef.current?.pause();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-20 overflow-hidden bg-white border-b-2 border-[#0A0A0A] mt-16"
    >
      {/* Hyperspeed WebGL background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Hyperspeed effectOptions={effectOptions} />
      </div>

      {/* Crisp light veil + subtle architectural grid for razor-sharp contrast */}
      <div
        className="absolute inset-0 bg-white/85 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Status badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border-2 border-[#0A0A0A] bg-white font-mono text-xs font-bold uppercase tracking-wider text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] mb-8 rounded-none"
        >
          <span className="w-2.5 h-2.5 bg-emerald-500 border border-[#0A0A0A] shrink-0" />
          Product Engineering Intern @ SOCIO · Bengaluru, India
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-[#0A0A0A] mb-4 leading-[1.02]"
        >
          Suryachalam <span className="text-[#E3000F] whitespace-nowrap">V M</span>
        </motion.h1>

        {/* Engineering positioning */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-[#0A0A0A] mb-6"
        >
          Full-Stack &amp; Product Engineer <span className="text-[#E3000F]">·</span> Systems Builder
        </motion.p>

        {/* Impact statement */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="text-base md:text-lg text-[#262626] font-medium max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Building scalable web platforms, offline-first mobile applications, and resilient
          real-time infrastructure. Currently shipping production features at{" "}
          <span className="font-bold text-[#0A0A0A] underline decoration-[#E3000F] decoration-2 underline-offset-4">
            SOCIO
          </span>
          .
        </motion.p>

        {/* Focus Areas */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          onMouseEnter={handleFocusPause}
          onMouseLeave={handleFocusResume}
          className="flex flex-wrap justify-center gap-2 mb-9"
        >
          {focusAreas.map((area, idx) => {
            const isActive = idx === activeFocusIndex;
            return (
              <button
                key={area}
                type="button"
                aria-pressed={isActive}
                onFocus={handleFocusPause}
                onBlur={handleFocusResume}
                onClick={() => handleFocusSelect(idx)}
                className={`relative overflow-hidden border-2 border-[#0A0A0A] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide rounded-none transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0A0A0A] text-white shadow-[3px_3px_0px_#E3000F]"
                    : "bg-white text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#FFF5F5]"
                }`}
              >
                <span>{area}</span>
                {isActive && (
                  <span
                    ref={progressBarRef}
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E3000F] origin-left scale-x-0 pointer-events-none"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="flex flex-col sm:flex-row gap-3.5 justify-center items-center mb-9"
        >
          <button
            type="button"
            id="hero-view-work-btn"
            onClick={() => smoothScrollTo("#projects")}
            className="group flex items-center gap-2 bg-[#E3000F] text-white border-2 border-[#0A0A0A] text-sm font-bold uppercase tracking-wider px-6 py-3.5 shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FF1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] rounded-none transition-all cursor-pointer"
          >
            <span>View Projects</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            id="hero-contact-btn"
            onClick={() => smoothScrollTo("#contact")}
            className="group flex items-center gap-2 bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] text-sm font-bold uppercase tracking-wider px-6 py-3.5 shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFF5F5] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] rounded-none transition-all cursor-pointer"
          >
            <Mail size={15} />
            <span>Contact Me</span>
          </button>

          <a
            id="hero-resume-download-btn"
            href="/resume.pdf"
            download="Suryachalam_VM_Resume.pdf"
            onClick={() => fetch("/api/analytics/download", { method: "POST" }).catch(() => {})}
            className="group flex items-center gap-2 bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] text-sm font-bold uppercase tracking-wider px-5 py-3.5 shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#FFF5F5] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] rounded-none transition-all"
          >
            <Download size={15} />
            <span>Resume</span>
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={6}
          className="flex items-center justify-center gap-3"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              id={s.id}
              href={s.href}
              target={s.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex items-center gap-2 border-2 border-[#0A0A0A] px-3 py-2 bg-white text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#E3000F] hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all rounded-none font-bold text-xs uppercase tracking-wider"
            >
              {s.icon}
              <span>{s.label}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
