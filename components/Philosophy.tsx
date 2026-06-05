"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const principles = [
  {
    number: "01",
    title: "Build for the next engineer",
    body: "Code is read far more than it is written. Every abstraction, variable name, and system boundary should communicate intent — not just to machines, but to the person on-call at 2am.",
  },
  {
    number: "02",
    title: "Measure before you optimize",
    body: "Premature optimization is where good systems go to die. Instrument first, identify the actual bottleneck, then fix it. A cache that solves the wrong problem is technical debt disguised as performance.",
  },
  {
    number: "03",
    title: "Prefer simple, push complexity to the edges",
    body: "A boring architecture that solves the problem beats an elegant one that introduces six new failure modes. Complexity is unavoidable — it should live at the boundaries where it's most visible and testable.",
  },
  {
    number: "04",
    title: "Security is architecture, not a checklist",
    body: "Authorization enforced only at the API layer is one bug away from a breach. Defense-in-depth means row-level security at the database, scoped tokens at the API, and input validation at every boundary.",
  },
  {
    number: "05",
    title: "Ship working software, then make it good",
    body: "A perfect system that never ships helps no one. The goal is to deliver value incrementally, with enough architecture to avoid rewriting everything in six months. Good enough and shipped beats perfect and planned.",
  },
  {
    number: "06",
    title: "Understand the why before the how",
    body: "Every technology choice carries tradeoffs. Picking a tool without understanding what problems it solves means you inherit its complexity without leveraging its strengths. Read the docs, not just the tutorials.",
  },
];

export default function Philosophy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="philosophy" className="section-padding bg-[var(--card)]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">
            06. Engineering Philosophy
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            How I{" "}
            <span className="gradient-text">think</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
            These are the principles that guide every technical decision I make — from database schema design to how I name a function.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group card-bg rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-3xl font-bold text-slate-800 group-hover:text-indigo-500/40 transition-colors select-none shrink-0">
                  {p.number}
                </span>
                <h3 className="text-slate-200 font-semibold leading-snug pt-1.5">
                  {p.title}
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
