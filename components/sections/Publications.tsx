"use client";

import Link from "next/link";
import { BookOpen, FileCheck2, MapPin, Users } from "lucide-react";
import { publicationsData } from "@/data/publications";
import ScrollReveal from "../ui/ScrollReveal";

export default function Publications() {
  return (
    <section
      id="publications"
      className="section-padding bg-white border-b-2 border-[#0A0A0A]"
    >
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">
              PUBLICATIONS
            </h2>
          </div>

          <div className="space-y-8">
            {publicationsData.map((pub) => (
              <article
                key={pub.id}
                className="border-2 border-[#0A0A0A] border-t-4 border-t-[#E3000F] bg-[#FFF5F5] p-6 md:p-8 shadow-[6px_6px_0px_#0A0A0A] rounded-none space-y-6"
              >
                {/* Top status & role row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[#0A0A0A] bg-[#E3000F] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#0A0A0A]">
                    <FileCheck2 size={13} aria-hidden="true" />
                    <span>{pub.status}</span>
                  </span>
                  <span className="px-3 py-1 border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#0A0A0A]">
                    {pub.role}
                  </span>
                </div>

                {/* Title & One-line summary */}
                <div className="space-y-3">
                  <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight text-[#0A0A0A] leading-snug">
                    {pub.title}
                  </h3>
                  <p className="font-mono text-xs md:text-sm font-bold text-[#0A0A0A] bg-white border-2 border-[#0A0A0A] p-3.5 shadow-[3px_3px_0px_#0A0A0A]">
                    {pub.oneLineSummary}
                  </p>
                </div>

                {/* Venue, Institution & Co-authors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="border-2 border-[#0A0A0A] bg-white p-4 shadow-[3px_3px_0px_#0A0A0A] space-y-2">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#E3000F]">
                      Conference Venue &amp; Institution
                    </p>
                    <p className="font-bold text-[#0A0A0A] leading-snug">
                      {pub.venue}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs font-mono text-[#3a3a3a] pt-1">
                      <MapPin size={13} className="text-[#E3000F] shrink-0" aria-hidden="true" />
                      <span>{pub.institution}</span>
                    </p>
                  </div>

                  <div className="border-2 border-[#0A0A0A] bg-white p-4 shadow-[3px_3px_0px_#0A0A0A] space-y-2">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#E3000F] flex items-center gap-1.5">
                      <Users size={13} aria-hidden="true" />
                      <span>Co-Authors</span>
                    </p>
                    <p className="font-medium text-[#3a3a3a] leading-relaxed">
                      {pub.coAuthors.join(" · ")}
                    </p>
                  </div>
                </div>

                {/* Short description */}
                <p className="text-sm md:text-base font-medium text-[#262626] leading-relaxed">
                  {pub.shortDescription}
                </p>

                {/* Key Highlights */}
                <div className="border-2 border-[#0A0A0A] bg-white p-5 shadow-[3px_3px_0px_#0A0A0A] space-y-2.5">
                  <p className="font-mono text-xs font-black uppercase tracking-wider text-[#0A0A0A]">
                    Key Contributions &amp; Highlights
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm font-medium text-[#3a3a3a]">
                    {pub.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#E3000F] font-bold shrink-0 mt-0.5">
                          ■
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags & Case study link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {pub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] px-2.5 py-0.5 font-mono text-xs font-bold shadow-[1.5px_1.5px_0px_#0A0A0A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${pub.caseStudySlug}`}
                    className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#E3000F] text-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FF1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all shrink-0 self-start sm:self-auto"
                  >
                    <BookOpen size={14} aria-hidden="true" />
                    <span>Read Full Case Study →</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
