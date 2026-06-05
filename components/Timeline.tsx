"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const milestones = [
  {
    date: "2022",
    title: "First Lines of Code",
    body: "Started with Python and C — learned fundamentals through competitive math problems. Discovered that programming and mathematics share the same underlying logic.",
    color: "text-slate-400",
    dot: "bg-slate-600",
  },
  {
    date: "2023",
    title: "Web Development",
    body: "Built first HTML/CSS/JS projects. Learned the DOM, asynchronous JavaScript, and how browsers render content. Shipped a static site for a school event.",
    color: "text-slate-400",
    dot: "bg-slate-600",
  },
  {
    date: "2024",
    title: "Full Stack Engineering",
    body: "Adopted React, Next.js, and Node.js. Built multi-page apps with authentication, databases, and deployment. Understood the difference between 'it works' and 'it scales'.",
    color: "text-slate-400",
    dot: "bg-indigo-500/60",
  },
  {
    date: "Jul 2025",
    title: "Production Systems @ CPP, CHRIST",
    body: "Built and maintained the official institutional website for Centre for Peace Praxis. First experience with real deployment, production bugs, and mobile-responsive design for a live audience.",
    color: "text-slate-300",
    dot: "bg-indigo-500",
  },
  {
    date: "2025",
    title: "Database Architecture & Offline Systems",
    body: "Deep-dived into PostgreSQL schema design, Row-Level Security, and indexing strategies. Built the first offline-first features with IndexedDB and service workers.",
    color: "text-slate-300",
    dot: "bg-indigo-500",
  },
  {
    date: "Apr 2026",
    title: "Product Engineering Intern @ SOCIO",
    body: "Selected via CICF to join SOCIO as a Product Engineering Intern. Shipped Valkey caching, push notification infrastructure (OneSignal + FCM + VAPID), and an offline-first QR scanner to a live production platform with real users.",
    color: "text-slate-100",
    dot: "bg-indigo-400",
    highlight: true,
  },
  {
    date: "Now",
    title: "System Design & Distributed Systems",
    body: "Actively studying distributed systems, consensus algorithms, and cloud infrastructure. Building toward architecting systems at scale — databases, queues, cache invalidation, and fault tolerance.",
    color: "text-indigo-300",
    dot: "bg-indigo-400 ring-4 ring-indigo-500/20",
    highlight: true,
  },
];

export default function Timeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="timeline" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">
            07. Career Journey
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Growth{" "}
            <span className="gradient-text">trajectory</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
            Every milestone represents a deliberate step — not just learning syntax, but understanding systems.
          </p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto lg:mx-0">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-slate-700 via-indigo-500/40 to-transparent" />

          <div className="space-y-10">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                className="relative flex gap-6 group"
              >
                {/* Dot */}
                <div className="relative z-10 shrink-0 mt-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${m.highlight ? "bg-[#09090e] border border-indigo-500/30" : "bg-[#09090e] border border-slate-800"}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
                  </div>
                </div>

                {/* Content */}
                <div className={`pb-2 flex-1 ${m.highlight ? "card-bg rounded-2xl p-5 border border-indigo-500/15 -mt-2" : ""}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs text-slate-500">{m.date}</span>
                  </div>
                  <h3 className={`font-semibold text-base mb-1.5 ${m.color}`}>{m.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{m.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
