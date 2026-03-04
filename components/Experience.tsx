"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";

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
    title: "Web Developer & Organising Committee Member",
    company: "Centre for Peace Praxis, CHRIST University",
    location: "Bengaluru, India",
    dates: "Jul 2025 – Present",
    type: "Part-time",
    achievements: [
      "Developed and maintained the official website using HTML5 and CSS3, including custom intro animations.",
      "Enhanced mobile responsiveness and improved cross-device compatibility across all pages.",
      "Collaborated with organising committees to support academic initiatives and event coordination.",
      "Managed structured version control workflows using Git and GitHub.",
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">04. Experience</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Where I&apos;ve{" "}
            <span className="gradient-text">worked</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/60 via-indigo-500/20 to-transparent" />

          <div className="flex flex-col gap-12">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative grid md:grid-cols-2 gap-6 md:gap-12 ${
                  i % 2 !== 0 ? "md:[&>*:first-child]:col-start-2" : ""
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute top-6 left-0 md:left-1/2 md:-translate-x-1/2 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-[var(--background)] z-10 shadow-[0_0_0_4px_rgba(99,102,241,0.15)]`}
                />

                {/* Card */}
                <div
                  className={`ml-8 md:ml-0 ${
                    i % 2 === 0 ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"
                  }`}
                >
                  <div className="card-bg rounded-2xl p-6 hover:border-indigo-500/30 transition-colors group">
                    {/* Header */}
                    <div className={`mb-4 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
                        <Briefcase size={11} />
                        {job.type}
                      </div>
                      <h3 className="text-lg font-bold text-slate-100">{job.title}</h3>
                      <p className="text-indigo-400 font-medium text-sm">{job.company}</p>
                    </div>

                    {/* Meta */}
                    <div
                      className={`flex flex-wrap gap-3 text-xs text-slate-500 mb-5 ${
                        i % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {job.dates}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {job.location}
                      </span>
                    </div>

                    {/* Achievements */}
                    <ul
                      className={`space-y-2.5 ${i % 2 === 0 ? "md:text-right" : ""}`}
                    >
                      {job.achievements.map((point, pi) => (
                        <li
                          key={pi}
                          className={`flex gap-3 text-sm text-slate-400 ${
                            i % 2 === 0 ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
