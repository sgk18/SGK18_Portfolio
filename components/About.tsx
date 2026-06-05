"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { User, MapPin, Coffee, Trophy } from "lucide-react";

const stats = [
  { label: "Year Coding", value: "1+" },
  { label: "Projects Built", value: "6+" },
  { label: "Hackathons", value: "3" },
  { label: "Cups of Coffee", value: "∞" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">01. About Me</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            A bit about{" "}
            <span className="gradient-text">myself</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-12 md:col-span-4 lg:col-span-3 flex justify-center"
          >
            <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border border-indigo-500/20 shadow-2xl group card-bg">
              <Image
                src="/surya.png"
                alt="Suryachalam V M"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 220px, 280px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090e]/60 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="col-span-12 md:col-span-8 lg:col-span-5 space-y-6"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <User size={14} className="text-indigo-400" />
              <span>Full-Stack & Product Engineer · Undergrad · Builder</span>
            </div>

            <p className="text-slate-300 leading-relaxed text-lg">
              I&apos;m a Full-Stack and Product Engineer with hands-on production experience
              building scalable hybrid platforms, real-time systems, and offline-first mobile applications.
              I specialise in building performant systems across the full stack, currently interning at
              SOCIO (startup-grade campus event platform) — from Valkey caching and push notifications to Capacitor hybrid apps.
            </p>

            <p className="text-slate-400 leading-relaxed">
              I&apos;m pursuing a BSc in Computer Science and Mathematics at CHRIST (Deemed to be University), Bengaluru.
              My academic coursework includes Data Structures &amp; Algorithms, Graph Theory, Linear Algebra,
              Discrete Mathematics, Object-Oriented Programming, and Database Systems. I thrive in high-paced sprint workflows
              where elegant architecture meets excellent user experience.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={14} className="text-indigo-400 shrink-0" />
                <span>Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Coffee size={14} className="text-indigo-400 shrink-0" />
                <span>Fueled by coffee & curiosity</span>
              </div>
            </div>
          </motion.div>

          {/* Stats & Achievements */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  className="card-bg rounded-2xl p-6 glow hover:border-indigo-500/30 transition-colors"
                >
                  <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                  <p className="text-slate-400 text-sm leading-snug">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Achievements & Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card-bg rounded-2xl p-6 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-indigo-400" />
                Achievements & Certifications
              </h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-start gap-2 text-indigo-300">
                  <span className="text-indigo-400 font-bold shrink-0">·</span>
                  <span><strong>Oracle Data Platform 2025 Foundations Associate</strong> — Issued by Oracle University (ID: 328494602OCI25DCFA, Valid through May 2028)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">·</span>
                  <span><strong>Runner-Up</strong> — Frontend Frenzy, Xactitude IT Fest 2026</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">·</span>
                  <span><strong>1st Place</strong> — Mathematics Premier League (MPL), SEQUENCE 2026</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">·</span>
                  <span><strong>3rd Prize</strong> — National Science Day Exhibition, CHRIST University</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">·</span>
                  <span><strong>Finisher</strong> — 24-Hour Solo Hackathon, CHRIST × Pod.ai (2026)</span>
                </li>
                <li className="flex items-start gap-2 border-t border-slate-800/60 pt-2.5">
                  <span className="text-indigo-400 font-bold shrink-0">·</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    <strong>Certifications:</strong> Oracle Data Platform 2025 Foundations Associate • Graph Theory (CHRIST) • HackerRank Python Basic • C Programming (Infosys Springboard) • AI Prompt Engineering (Microsoft)
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
