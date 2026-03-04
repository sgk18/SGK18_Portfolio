"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
        >
          <Sparkles size={14} className="animate-pulse" />
          Available for new opportunities
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
        >
          Hi, I&apos;m{" "}
          <span className="gradient-text">Surya</span>
          <br />
          <span className="text-slate-200">Creative Developer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Building{" "}
          <span className="text-slate-200 font-medium">scalable web applications</span> and
          crafting{" "}
          <span className="text-slate-200 font-medium">immersive digital experiences</span>{" "}
          — Maths &amp; CS undergrad at CHRIST University, Bengaluru.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={scrollToProjects}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            View My Work
            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
          <a
            href="/resume.pdf"
            download
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--border)] text-slate-300 font-semibold text-sm hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Download size={16} />
            Download Resume
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-slate-600 cursor-pointer"
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
