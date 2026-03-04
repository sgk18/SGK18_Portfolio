"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { User, MapPin, Coffee } from "lucide-react";

const stats = [
  { label: "Years Coding", value: "2+" },
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

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <User size={14} className="text-indigo-400" />
              <span>Creative Developer · Builder · Problem Solver</span>
            </div>

            <p className="text-slate-300 leading-relaxed text-lg">
              I&apos;m a Creative Developer and undergrad in Mathematics and Computer Science at
              CHRIST (Deemed to be University), Bengaluru. I specialise in frontend development,
              3D web integration, and building scalable, AI-enhanced web applications using
              Next.js, Python, MongoDB, and Supabase.
            </p>

            <p className="text-slate-400 leading-relaxed">
              I&apos;ve led university-level web initiatives — from the official Centre for Peace
              Praxis website to large-scale event platforms — and I thrive in collaborative
              environments where great engineering meets thoughtful user experience. When I&apos;m
              not pushing commits, you&apos;ll find me at a hackathon or experimenting with
              Three.js and interactive 3D experiences.
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

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
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
        </div>
      </div>
    </section>
  );
}
