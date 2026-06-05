"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  Smartphone,
  Server,
  Wrench,
} from "lucide-react";

type Skill = { name: string };
type Category = {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
};

const categories: Category[] = [
  {
    title: "Languages",
    icon: <Code2 size={16} />,
    color: "from-blue-500/20 to-indigo-500/20 border-indigo-500/20",
    skills: [
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "Python" },
      { name: "Java" },
      { name: "Dart" },
      { name: "SQL" },
      { name: "PL/SQL" },
      { name: "C++" },
    ],
  },
  {
    title: "Frontend & Mobile",
    icon: <Smartphone size={16} />,
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/20",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Flutter" },
      { name: "Capacitor" },
      { name: "Tailwind CSS" },
      { name: "PWA" },
      { name: "Service Workers" },
    ],
  },
  {
    title: "Backend & Infra",
    icon: <Server size={16} />,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20",
    skills: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "PostgreSQL" },
      { name: "Oracle DB" },
      { name: "MongoDB" },
      { name: "Valkey" },
      { name: "MySQL HeatWave" },
      { name: "Docker" },
    ],
  },
  {
    title: "Integrations & Tools",
    icon: <Wrench size={16} />,
    color: "from-orange-500/20 to-amber-500/20 border-orange-500/20",
    skills: [
      { name: "OCI" },
      { name: "CI/CD" },
      { name: "FCM" },
      { name: "OneSignal" },
      { name: "Google OAuth" },
      { name: "Resend" },
      { name: "Git & GitHub" },
      { name: "Vercel" },
    ],
  },
];

const pillColors: Record<string, string> = {
  Languages: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20",
  "Frontend & Mobile": "bg-pink-500/10 text-pink-300 border-pink-500/20 hover:bg-pink-500/20",
  "Backend & Infra": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20",
  "Integrations & Tools": "bg-orange-500/10 text-orange-300 border-orange-500/20 hover:bg-orange-500/20",
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="section-padding bg-[var(--card)]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">02. Skills</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            My{" "}
            <span className="gradient-text">toolkit</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, catI) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: catI * 0.1 }}
              className={`card-bg rounded-2xl p-6 bg-gradient-to-br ${cat.color} border hover:border-opacity-60 transition-all duration-300`}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-slate-300">{cat.icon}</span>
                <h3 className="font-semibold text-slate-200 text-sm">{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, skillI) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: catI * 0.1 + skillI * 0.05,
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-default ${
                      pillColors[cat.title]
                    }`}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
