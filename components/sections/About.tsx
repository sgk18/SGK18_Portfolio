"use client";

import Image from "next/image";
import { User, MapPin, Coffee, Trophy } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const stats = [
  { label: "Year Coding", value: "1+" },
  { label: "Projects Built", value: "10+" },
  { label: "Hackathons", value: "3" },
  { label: "Cups of Coffee", value: "∞" },
];

const achievements = [
  "Runner-Up — Frontend Frenzy, Xactitude IT Fest 2026",
  "1st Place — Mathematics Premier League (MPL), SEQUENCE 2026",
  "Participant — Madhava Mathematics Competition 2026",
  "3rd Prize — National Science Day Exhibition, CHRIST University",
  "Finisher — 24-Hour Solo Hackathon, CHRIST × Pod.ai (2026)",
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-[#FFF5F5] border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">ABOUT ME</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Profile Photo */}
            <div className="col-span-1 md:col-span-4 lg:col-span-3 flex justify-center">
              <div className="relative w-full max-w-[280px] aspect-square rounded-none overflow-hidden border-4 border-[#0A0A0A] shadow-[8px_8px_0px_#0A0A0A] bg-white group">
                <Image
                  src="/surya.png"
                  alt="Suryachalam V M"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 220px, 280px"
                  priority
                />
              </div>
            </div>

            {/* Bio */}
            <div className="col-span-1 md:col-span-8 lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-[#0A0A0A] font-mono text-sm font-bold">
                <User size={16} className="text-[#E3000F] shrink-0" />
                <span>Full-Stack & Product Engineer · Undergrad · Builder</span>
              </div>

              <p className="text-[#0A0A0A] font-medium leading-relaxed text-lg">
                I&apos;m a Full-Stack and Product Engineer with hands-on production experience
                building scalable hybrid platforms, real-time systems, and offline-first mobile applications.
                I specialise in building performant systems across the full stack, currently interning at
                SOCIO (startup-grade campus event platform) — from Valkey caching and push notifications to Capacitor hybrid apps.
              </p>

              <p className="text-[#3a3a3a] font-medium leading-relaxed">
                I&apos;m pursuing a BSc in Computer Science and Mathematics at CHRIST (Deemed to be University), Bengaluru.
                My academic coursework includes Data Structures &amp; Algorithms, Graph Theory, Linear Algebra,
                Discrete Mathematics, Object-Oriented Programming, and Database Systems. I thrive in high-paced sprint workflows
                where elegant architecture meets excellent user experience.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-[#0A0A0A] font-mono text-xs font-bold border-2 border-[#0A0A0A] bg-white px-2 py-1 shadow-[2px_2px_0px_#0A0A0A]">
                  <MapPin size={12} className="text-[#E3000F] shrink-0" />
                  <span>Bengaluru, India</span>
                </div>
                <div className="flex items-center gap-2 text-[#0A0A0A] font-mono text-xs font-bold border-2 border-[#0A0A0A] bg-white px-2 py-1 shadow-[2px_2px_0px_#0A0A0A]">
                  <Coffee size={12} className="text-[#E3000F] shrink-0" />
                  <span>Fueled by coffee & curiosity</span>
                </div>
              </div>
            </div>

            {/* Stats & Achievements */}
            <div className="col-span-1 md:col-span-12 lg:col-span-4 space-y-8">
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-2 border-[#0A0A0A] bg-white p-5 shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] rounded-none transition-all"
                  >
                    <p className="text-3xl font-black text-[#E3000F] mb-1 font-mono">{stat.value}</p>
                    <p className="text-[#0A0A0A] font-bold text-xs uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Achievements Card */}
              <div className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_#0A0A0A] rounded-none">
                <h3 className="text-lg font-black text-[#0A0A0A] mb-4 flex items-center gap-2 uppercase tracking-tight">
                  <Trophy size={18} className="text-[#E3000F]" />
                  Key Achievements
                </h3>
                <ul className="space-y-3 text-[#3a3a3a] text-sm font-medium">
                  {achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#E3000F] font-bold shrink-0 mt-0.5">■</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

