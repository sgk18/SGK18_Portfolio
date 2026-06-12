"use client";

import ScrollReveal from "../ui/ScrollReveal";

type Job = {
  title: string;
  company: string;
  location: string;
  dates: string;
  type: string;
  achievements: string[];
};

const jobs: Job[] = [
  {
    title: "Product Engineering Intern",
    company: "SOCIO — Campus Event Platform (CHRIST Incubation and Consultancy Foundation)",
    location: "Bengaluru, India",
    dates: "Apr 2026 – Present",
    type: "Internship",
    achievements: [
      "Implemented a Valkey (Redis-compatible) caching layer for session management, notification queuing, real-time attendance counters, and PostgreSQL load reduction.",
      "Built push notification infrastructure with OneSignal, FCM, Web Push/VAPID, and Service Workers for simultaneous PWA and Native Android delivery.",
      "Developed an offline-first QR scanner using IndexedDB/Dexie.js with background sync, cooldown-based duplicate prevention, and conflict resolution.",
      "Shipped features across Web, PWA, and Native Android (Capacitor) simultaneously under high-tempo agile sprint workflows.",
    ],
  },
  {
    title: "Web Developer & Organising Committee Member",
    company: "Centre for Peace Praxis, CHRIST University",
    location: "Bengaluru, India",
    dates: "Jul 2025 – Present",
    type: "Part-time",
    achievements: [
      "Developed and maintained the official website using HTML5 and CSS3, including custom animations.",
      "Enhanced mobile responsiveness and improved cross-device compatibility across all pages.",
      "Collaborated with organising committees to support academic initiatives and event coordination.",
      "Managed structured version control workflows using Git and GitHub.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-padding bg-white border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">EXPERIENCE</h2>
          </div>

          {/* Timeline container */}
          <div className="relative border-l-4 border-[#E3000F] pl-6 ml-2 space-y-10">
            {jobs.map((job, i) => (
              <div key={i} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-[32px] top-6 w-3 h-3 bg-[#E3000F] border-2 border-[#0A0A0A] rounded-none" />

                {/* Experience card */}
                <div className="border-2 border-[#0A0A0A] bg-[#FFF5F5] p-5 shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#0A0A0A] rounded-none transition-all">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="inline-block px-2 py-0.5 border border-[#0A0A0A] bg-white text-xs font-mono font-bold text-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A] mb-2">
                        {job.type}
                      </span>
                      <h3 className="font-black uppercase text-lg text-[#0A0A0A] leading-snug">
                        {job.company}
                      </h3>
                      <p className="font-mono text-sm text-[#E3000F] font-bold mt-0.5">
                        {job.title}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 md:items-end shrink-0">
                      <span className="border-2 border-[#0A0A0A] bg-white font-mono text-xs px-2 py-0.5 shadow-[2px_2px_0px_#0A0A0A] text-[#0A0A0A] font-bold whitespace-nowrap">
                        {job.dates}
                      </span>
                      <span className="text-xs text-[#666666] font-mono">
                        {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Achievements */}
                  <ul className="space-y-2.5 text-[#3a3a3a] text-sm font-medium">
                    {job.achievements.map((point, pi) => (
                      <li key={pi} className="flex gap-2.5 items-start">
                        <span className="text-[#E3000F] font-bold shrink-0 mt-0.5">■</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

