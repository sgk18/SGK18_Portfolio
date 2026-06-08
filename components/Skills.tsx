"use client";

import {
  Code2,
  Smartphone,
  Server,
  Wrench,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

type Skill = { name: string };
type Category = {
  title: string;
  icon: React.ReactNode;
  skills: Skill[];
};

const categories: Category[] = [
  {
    title: "Languages",
    icon: <Code2 size={16} />,
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

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-white border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">TECH STACK</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] rounded-none transition-all duration-150"
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#0A0A0A]">
                  <span className="text-[#0A0A0A]">{cat.icon}</span>
                  <h3 className="font-black uppercase text-[#E3000F] text-xs tracking-widest">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] px-3 py-1 
                                 font-mono text-sm font-bold shadow-[3px_3px_0px_#0A0A0A] 
                                 hover:bg-[#E3000F] hover:text-white hover:-translate-x-0.5 
                                 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] 
                                 transition-all cursor-default rounded-none inline-block"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

