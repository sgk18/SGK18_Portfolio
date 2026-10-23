"use client";

import {
  Code2,
  Smartphone,
  Server,
  Wrench,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

type Skill = {
  name: string;
  sprite: string;
};

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
      { name: "TypeScript", sprite: "/sprites/skills/typescript.png" },
      { name: "JavaScript", sprite: "/sprites/skills/javascript.png" },
      { name: "Python", sprite: "/sprites/skills/python.png" },
      { name: "Java", sprite: "/sprites/skills/java.png" },
      { name: "Dart", sprite: "/sprites/skills/dart.png" },
      { name: "SQL", sprite: "/sprites/skills/sql.png" },
      { name: "PL/SQL", sprite: "/sprites/skills/plsql.png" },
      { name: "C++", sprite: "/sprites/skills/cpp.png" },
    ],
  },
  {
    title: "Frontend & Mobile",
    icon: <Smartphone size={16} />,
    skills: [
      { name: "React", sprite: "/sprites/skills/react.png" },
      { name: "Next.js", sprite: "/sprites/skills/nextjs.png" },
      { name: "Flutter", sprite: "/sprites/skills/flutter.png" },
      { name: "Capacitor", sprite: "/sprites/skills/capacitor.png" },
      { name: "Tailwind CSS", sprite: "/sprites/skills/tailwindcss.png" },
      { name: "PWA", sprite: "/sprites/skills/pwa.png" },
      { name: "Service Workers", sprite: "/sprites/skills/serviceworkers.png" },
    ],
  },
  {
    title: "Backend & Infra",
    icon: <Server size={16} />,
    skills: [
      { name: "Node.js", sprite: "/sprites/skills/nodejs.png" },
      { name: "Express", sprite: "/sprites/skills/express.png" },
      { name: "PostgreSQL", sprite: "/sprites/skills/postgresql.png" },
      { name: "Oracle DB", sprite: "/sprites/skills/oracledb.png" },
      { name: "MongoDB", sprite: "/sprites/skills/mongodb.png" },
      { name: "Valkey", sprite: "/sprites/skills/valkey.png" },
      { name: "MySQL HeatWave", sprite: "/sprites/skills/mysqlheatwave.png" },
      { name: "Docker", sprite: "/sprites/skills/docker.png" },
    ],
  },
  {
    title: "Integrations & Tools",
    icon: <Wrench size={16} />,
    skills: [
      { name: "OCI", sprite: "/sprites/skills/oci.png" },
      { name: "CI/CD", sprite: "/sprites/skills/cicd.png" },
      { name: "FCM", sprite: "/sprites/skills/fcm.png" },
      { name: "OneSignal", sprite: "/sprites/skills/onesignal.png" },
      { name: "Google OAuth", sprite: "/sprites/skills/googleoauth.png" },
      { name: "Resend", sprite: "/sprites/skills/resend.png" },
      { name: "Git & GitHub", sprite: "/sprites/skills/gitgithub.png" },
      { name: "Vercel", sprite: "/sprites/skills/vercel.png" },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-white border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
              <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">TECH STACK</h2>
            </div>
            <span className="border-2 border-[#0A0A0A] bg-[#FFF5F5] text-[#0A0A0A] px-2.5 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_#0A0A0A] rounded-none">
              2D SPRITES EQUIPPED · 31 SKILLS
            </span>
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
                      className="border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] px-2.5 py-1.5 
                                 font-mono text-sm font-bold shadow-[3px_3px_0px_#0A0A0A] 
                                 hover:bg-[#E3000F] hover:text-white hover:-translate-x-0.5 
                                 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] 
                                 transition-all cursor-default rounded-none inline-flex items-center gap-2 group"
                    >
                      <img
                        src={skill.sprite}
                        alt=""
                        width={18}
                        height={18}
                        className="w-[18px] h-[18px] shrink-0 [image-rendering:pixelated] group-hover:scale-110 transition-transform"
                        loading="lazy"
                      />
                      <span>{skill.name}</span>
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
