"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, ChevronRight } from "lucide-react";
import { CaseStudy } from "@/data/caseStudies";

interface Props {
  study: CaseStudy | null;
  onClose: () => void;
}

// Mermaid diagram loader
function MermaidDiagram({ chart, id }: { chart: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !chart) return;
    let cancelled = false;

    import("mermaid").then((mermaid) => {
      if (cancelled) return;
      mermaid.default.initialize({
        startOnLoad: false,
        theme: "default",
        themeVariables: {
          background: "#ffffff",
          primaryColor: "#fff5f5",
          primaryTextColor: "#0a0a0a",
          primaryBorderColor: "#0a0a0a",
          lineColor: "#e3000f",
          secondaryColor: "#ffffff",
          tertiaryColor: "#ffffff",
        },
      });
      mermaid.default.render(id, chart.trim()).then(({ svg }) => {
        if (ref.current && !cancelled) {
          ref.current.innerHTML = svg;
        }
      }).catch(() => {
        if (ref.current && !cancelled) {
          ref.current.innerHTML = `<pre class="text-xs text-[#0a0a0a] p-4 overflow-auto">${chart}</pre>`;
        }
      });
    }).catch(() => {
      if (ref.current && !cancelled) {
        ref.current.innerHTML = `<pre class="text-xs text-[#0a0a0a] p-4 overflow-auto">${chart}</pre>`;
      }
    });

    return () => { cancelled = true; };
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="bg-white rounded-none border-2 border-[#0A0A0A] p-4 overflow-auto min-h-[100px] flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A]"
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-mono uppercase tracking-widest text-[#E3000F] font-bold">{title}</h4>
      {children}
    </div>
  );
}

export default function CaseStudyModal({ study, onClose }: Props) {
  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (study) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [study]);

  return (
    <AnimatePresence>
      {study && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs"
          />

          {/* Slide-over panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-3xl flex flex-col bg-white border-l-4 border-l-[#0A0A0A] shadow-[-8px_0px_0px_rgba(10,10,10,0.15)]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b-2 border-b-[#0A0A0A] shrink-0 bg-[#FFF5F5]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  {study.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-none bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[1.5px_1.5px_0px_#0A0A0A]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-black uppercase text-[#0A0A0A] tracking-tight">{study.title}</h2>
                <p className="text-sm text-[#E3000F] font-bold uppercase tracking-wider">{study.tagline}</p>
                <div className="flex flex-wrap gap-3 text-xs text-[#666666] font-mono pt-1">
                  <span>{study.period}</span>
                  <span>·</span>
                  <span>{study.role}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close case study"
                className="shrink-0 p-2 border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_#0A0A0A] active:translate-x-0 active:translate-y-0 transition-all rounded-none cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-white text-[#0A0A0A]">

              {/* Problem + Motivation */}
              <Section title="01 · Problem">
                <p className="text-[#3a3a3a] text-sm font-medium leading-relaxed">{study.problem}</p>
              </Section>

              <Section title="02 · Motivation">
                <p className="text-[#3a3a3a] text-sm font-medium leading-relaxed">{study.motivation}</p>
              </Section>

              {/* Solution */}
              <Section title="03 · Solution">
                <p className="text-[#3a3a3a] text-sm font-medium leading-relaxed">{study.solution}</p>
              </Section>

              {/* System Architecture */}
              {study.architecture && (
                <Section title="04 · System Architecture">
                  <MermaidDiagram chart={study.architecture} id={`arch-${study.id}`} />
                </Section>
              )}

              {/* Database Design */}
              {study.databaseDesign && (
                <Section title="05 · Database Design">
                  <MermaidDiagram chart={study.databaseDesign} id={`db-${study.id}`} />
                </Section>
              )}

              {/* Technologies Used */}
              <Section title="06 · Technologies Used — Why Each Was Chosen">
                <div className="space-y-3">
                  {study.technologiesUsed.map((t) => (
                    <div key={t.name} className="flex gap-3 p-4 rounded-none bg-[#FFF5F5] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                      <ChevronRight size={14} className="text-[#E3000F] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-black text-slate-900 text-sm uppercase">{t.name}</p>
                        <p className="text-[#3a3a3a] text-xs font-medium leading-relaxed mt-0.5">{t.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Technical Challenges */}
              <Section title="07 · Technical Challenges">
                <div className="space-y-4">
                  {study.technicalChallenges.map((tc, i) => (
                    <div key={i} className="p-4 rounded-none border-2 border-[#0A0A0A] bg-[#FFF5F5] shadow-[4px_4px_0px_#0A0A0A] space-y-2">
                      <p className="text-sm font-black uppercase text-[#E3000F]">{tc.challenge}</p>
                      <p className="text-xs text-[#3a3a3a] font-medium leading-relaxed">{tc.resolution}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Lessons Learned */}
              <Section title="08 · Lessons Learned">
                <ul className="space-y-2">
                  {study.lessonsLearned.map((l, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#0A0A0A] font-medium">
                      <span className="text-[#E3000F] mt-0.5 font-bold">→</span>
                      <span className="leading-relaxed">{l}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Future Improvements */}
              <Section title="09 · Future Improvements">
                <ul className="space-y-2">
                  {study.futureImprovements.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#666666] font-medium">
                      <span className="text-[#E3000F] mt-0.5">■</span>
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* Footer with links */}
            {study.links.length > 0 && (
              <div className="shrink-0 flex flex-wrap gap-3 p-6 border-t-2 border-t-[#0A0A0A] bg-[#FFF5F5]">
                {study.links.map((link) => {
                  const isGithub = link.url.includes("github.com");
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] font-bold uppercase shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFF5F5] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all text-xs tracking-wider rounded-none"
                    >
                      {isGithub ? <Github size={14} /> : <ExternalLink size={14} />}
                      {link.label}
                    </a>
                  );
                })}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
