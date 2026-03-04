"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Layout,
  Server,
  Wrench,
  Users,
} from "lucide-react";

type Skill = { name: string; level?: number };
type Category = {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
};

const categories: Category[] = [
  {
    title: "Frontend",
    icon: <Layout size={16} />,
    color: "from-blue-500/20 to-indigo-500/20 border-indigo-500/20",
    skills: [
      { name: "HTML5 & CSS3" },
      { name: "JavaScript (ES6+)" },
      { name: "TypeScript" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "Three.js" },
    ],
  },
  {
    title: "Backend & Data",
    icon: <Server size={16} />,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20",
    skills: [
      { name: "Python" },
      { name: "C" },
      { name: "SQL" },
      { name: "MongoDB" },
      { name: "Supabase" },
      { name: "REST APIs" },
    ],
  },
  {
    title: "Tools & Platforms",
    icon: <Wrench size={16} />,
    color: "from-orange-500/20 to-amber-500/20 border-orange-500/20",
    skills: [
      { name: "Git & GitHub" },
      { name: "Figma" },
      { name: "Vercel" },
      { name: "Bootstrap" },
      { name: "Responsive Web Design" },
      { name: "3D Modeling Integration" },
    ],
  },
  {
    title: "Soft Skills",
    icon: <Users size={16} />,
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/20",
    skills: [
      { name: "Problem Solving" },
      { name: "Communication" },
      { name: "Team Collaboration" },
      { name: "Leadership" },
      { name: "Event Organisation" },
      { name: "Version Control" },
    ],
  },
];

const pillColors: Record<string, string> = {
  Frontend: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20",
  "Backend & Data": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20",
  "Tools & Platforms": "bg-orange-500/10 text-orange-300 border-orange-500/20 hover:bg-orange-500/20",
  "Soft Skills": "bg-pink-500/10 text-pink-300 border-pink-500/20 hover:bg-pink-500/20",
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
