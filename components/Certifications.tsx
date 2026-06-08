"use client";

import { Award, Database, GitFork, Code, Terminal, Cpu } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const certifications = [
  {
    name: "Oracle Data Platform 2025 Foundations Associate",
    issuer: "Oracle University",
    details: "Credential ID: 328494602OCI25DCFA · Valid through May 2028",
    iconName: "database"
  },
  {
    name: "Graph Theory",
    issuer: "CHRIST University",
    details: "Academic certification covering graph algorithms and structures",
    iconName: "network"
  },
  {
    name: "HackerRank Python Basic",
    issuer: "HackerRank",
    details: "Verified proficiency in Python syntax, structures, and algorithms",
    iconName: "code"
  },
  {
    name: "C Programming",
    issuer: "Infosys Springboard",
    details: "Foundational software development, memory management, and systems building in C",
    iconName: "terminal"
  },
  {
    name: "AI Prompt Engineering",
    issuer: "Microsoft",
    details: "Best practices in LLM reasoning, structural prompt design, and task validation",
    iconName: "brain"
  }
];

function getIcon(name: string) {
  switch (name) {
    case "database": return <Database className="text-[#0A0A0A] w-6 h-6" />;
    case "network": return <GitFork className="text-[#0A0A0A] w-6 h-6" />;
    case "code": return <Code className="text-[#0A0A0A] w-6 h-6" />;
    case "terminal": return <Terminal className="text-[#0A0A0A] w-6 h-6" />;
    case "brain": return <Cpu className="text-[#0A0A0A] w-6 h-6" />;
    default: return <Award className="text-[#0A0A0A] w-6 h-6" />;
  }
}

export default function Certifications() {
  return (
    <section id="certifications" className="section-padding bg-[#FFF5F5] border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">CERTIFICATIONS</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <div 
                key={cert.name} 
                className="border-2 border-[#0A0A0A] bg-white p-5 shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#0A0A0A] rounded-none transition-all flex items-start gap-4"
              >
                {/* Badge/logo area */}
                <div className="border-2 border-[#0A0A0A] p-3 bg-white shadow-[3px_3px_0px_#0A0A0A] rounded-none shrink-0 flex items-center justify-center">
                  {getIcon(cert.iconName)}
                </div>

                {/* Text info */}
                <div className="space-y-1">
                  <span className="text-[#E3000F] font-mono text-xs font-bold uppercase tracking-wider">
                    {cert.issuer}
                  </span>
                  <h3 className="font-black uppercase text-base text-[#0A0A0A] leading-snug">
                    {cert.name}
                  </h3>
                  <p className="text-[#666666] font-mono text-xs">
                    {cert.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
