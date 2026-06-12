"use client";

import ScrollReveal from "../ui/ScrollReveal";
import { Users, Mic2 } from "lucide-react";

type Activity = {
  category: "Volunteer" | "Leadership";
  title: string;
  org: string;
  date: string;
  points: string[];
};

const activities: Activity[] = [
  /* ── Leadership ──────────────────────────────────── */
  {
    category: "Leadership",
    title: "Guest Speaker & Workshop Facilitator",
    org: "CHRIST University — Junior Student Orientation Session",
    date: "Jun 2026",
    points: [
      "Co-facilitated \"Build Your Professional Identity from Day 1\" for junior students alongside Dhinesh Karthik, covering LinkedIn, GitHub, networking, and early career strategy.",
      "Guided students on leveraging projects and consistency to unlock internships from their first year of college.",
      "First public speaking engagement before a large audience — reinforced the value of stepping outside comfort zones.",
      "Strengthened communication, leadership, and peer-mentoring skills.",
    ],
  },

  /* ── Volunteer ───────────────────────────────────── */
  {
    category: "Volunteer",
    title: "Volunteer — Industry Delegate Host",
    org: "Industry-Academia Conclave '26, School of Sciences, CHRIST University",
    date: "2026",
    points: [
      "Primary point of contact for industry delegates, ensuring a seamless and welcoming experience throughout the day.",
      "Guided guests through knowledge tracks, networking sessions, and department-level panel discussions on graduate preparedness.",
      "Gained firsthand exposure to conversations between industry leaders and academic experts on future-ready skills.",
      "Strengthened professional communication and hospitality skills representing CHRIST University.",
    ],
  },
  {
    category: "Volunteer",
    title: "Moderator",
    org: "inbloom eSports — Science and Technology",
    date: "2025",
    points: [
      "Moderated and supervised online chess matches conducted on Chess.com, ensuring fair play and smooth execution of the tournament.",
      "Managed player coordination, handled disputes, monitored gameplay for fair play compliance, and supported round management for a large-scale event.",
      "Collaborated with the organising committee, contributing to event operations and gaining exposure to leadership roles within the esports ecosystem.",
    ],
  },
  {
    category: "Volunteer",
    title: "Volunteer — INTERFACE 2025",
    org: "Department of Computer Science, CHRIST University",
    date: "2025",
    points: [
      "Received a Certificate of Appreciation for contributions at INTERFACE 2025, organised by the Department of Computer Science.",
      "Coordinated event logistics with a team of peers, ensuring smooth execution across all sessions.",
      "Sharpened organisational and teamwork skills while contributing to a campus tech community initiative.",
    ],
  },
];

const categoryMeta = {
  Leadership: {
    icon: Mic2,
    accent: "#E3000F",
    bg: "bg-[#FFF5F5]",
    label: "Leadership",
  },
  Volunteer: {
    icon: Users,
    accent: "#0A0A0A",
    bg: "bg-white",
    label: "Volunteer",
  },
};

export default function VolunteerLeadership() {
  const leadership = activities.filter((a) => a.category === "Leadership");
  const volunteer = activities.filter((a) => a.category === "Volunteer");

  return (
    <section
      id="volunteer-leadership"
      className="section-padding bg-[#FFF5F5] border-b-2 border-[#0A0A0A]"
    >
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">
              VOLUNTEER &amp; LEADERSHIP
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* ── Leadership column ── */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Mic2 size={16} className="text-[#E3000F]" />
                <span className="font-black uppercase text-sm tracking-widest text-[#E3000F]">
                  Leadership
                </span>
              </div>
              <div className="relative border-l-4 border-[#E3000F] pl-6 ml-2 space-y-8">
                {leadership.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[32px] top-5 w-3 h-3 bg-[#E3000F] border-2 border-[#0A0A0A] rounded-none" />
                    <div className="border-2 border-[#0A0A0A] bg-white p-5 shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#0A0A0A] transition-all rounded-none">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-black uppercase text-base text-[#0A0A0A] leading-snug">
                            {item.title}
                          </h3>
                          <p className="font-mono text-xs text-[#E3000F] font-bold mt-0.5">
                            {item.org}
                          </p>
                        </div>
                        <span className="border-2 border-[#0A0A0A] bg-white font-mono text-xs px-2 py-0.5 shadow-[2px_2px_0px_#0A0A0A] text-[#0A0A0A] font-bold whitespace-nowrap shrink-0">
                          {item.date}
                        </span>
                      </div>
                      <ul className="space-y-2 text-[#3a3a3a] text-sm font-medium">
                        {item.points.map((pt, pi) => (
                          <li key={pi} className="flex gap-2.5 items-start">
                            <span className="text-[#E3000F] font-bold shrink-0 mt-0.5">■</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Volunteer column ── */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Users size={16} className="text-[#0A0A0A]" />
                <span className="font-black uppercase text-sm tracking-widest text-[#0A0A0A]">
                  Volunteer
                </span>
              </div>
              <div className="relative border-l-4 border-[#0A0A0A] pl-6 ml-2 space-y-8">
                {volunteer.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[32px] top-5 w-3 h-3 bg-[#0A0A0A] border-2 border-[#0A0A0A] rounded-none" />
                    <div className="border-2 border-[#0A0A0A] bg-[#FFF5F5] p-5 shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#0A0A0A] transition-all rounded-none">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-black uppercase text-base text-[#0A0A0A] leading-snug">
                            {item.title}
                          </h3>
                          <p className="font-mono text-xs text-[#666666] font-bold mt-0.5">
                            {item.org}
                          </p>
                        </div>
                        <span className="border-2 border-[#0A0A0A] bg-white font-mono text-xs px-2 py-0.5 shadow-[2px_2px_0px_#0A0A0A] text-[#0A0A0A] font-bold whitespace-nowrap shrink-0">
                          {item.date}
                        </span>
                      </div>
                      <ul className="space-y-2 text-[#3a3a3a] text-sm font-medium">
                        {item.points.map((pt, pi) => (
                          <li key={pi} className="flex gap-2.5 items-start">
                            <span className="text-[#0A0A0A] font-bold shrink-0 mt-0.5">■</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
