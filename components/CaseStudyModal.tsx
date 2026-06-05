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
        theme: "dark",
        themeVariables: {
          background: "#0d0d18",
          primaryColor: "#1e1e2e",
          primaryTextColor: "#cbd5e1",
          primaryBorderColor: "#6366f1",
          lineColor: "#6366f1",
          secondaryColor: "#12121a",
          tertiaryColor: "#12121a",
        },
      });
      mermaid.default.render(id, chart.trim()).then(({ svg }) => {
        if (ref.current && !cancelled) {
          ref.current.innerHTML = svg;
        }
      }).catch(() => {
        if (ref.current && !cancelled) {
          ref.current.innerHTML = `<pre class="text-xs text-slate-400 p-4 overflow-auto">${chart}</pre>`;
        }
      });
    }).catch(() => {
      if (ref.current && !cancelled) {
        ref.current.innerHTML = `<pre class="text-xs text-slate-400 p-4 overflow-auto">${chart}</pre>`;
      }
    });

    return () => { cancelled = true; };
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="bg-[#0d0d18] rounded-xl border border-slate-800 p-4 overflow-auto min-h-[100px] flex items-center justify-center"
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-mono uppercase tracking-widest text-indigo-400">{title}</h4>
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
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-over panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-3xl flex flex-col bg-[#09090e] border-l border-slate-800 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-800 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {study.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-slate-100">{study.title}</h2>
                <p className="text-sm text-slate-400">{study.tagline}</p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-1">
                  <span>{study.period}</span>
                  <span>·</span>
                  <span>{study.role}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close case study"
                className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10">

              {/* Problem + Motivation */}
              <Section title="01 · Problem">
                <p className="text-slate-300 text-sm leading-relaxed">{study.problem}</p>
              </Section>

              <Section title="02 · Motivation">
                <p className="text-slate-300 text-sm leading-relaxed">{study.motivation}</p>
              </Section>

              {/* Solution */}
              <Section title="03 · Solution">
                <p className="text-slate-300 text-sm leading-relaxed">{study.solution}</p>
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
                    <div key={t.name} className="flex gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <ChevronRight size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-200 text-sm">{t.name}</p>
                        <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{t.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Technical Challenges */}
              <Section title="07 · Technical Challenges">
                <div className="space-y-4">
                  {study.technicalChallenges.map((tc, i) => (
                    <div key={i} className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                      <p className="text-sm font-semibold text-amber-300">{tc.challenge}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{tc.resolution}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Lessons Learned */}
              <Section title="08 · Lessons Learned">
                <ul className="space-y-2">
                  {study.lessonsLearned.map((l, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-300">
                      <span className="text-indigo-400 mt-0.5">→</span>
                      <span className="leading-relaxed">{l}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Future Improvements */}
              <Section title="09 · Future Improvements">
                <ul className="space-y-2">
                  {study.futureImprovements.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-400">
                      <span className="text-emerald-400 mt-0.5">◆</span>
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* Footer with links */}
            {study.links.length > 0 && (
              <div className="shrink-0 flex flex-wrap gap-3 p-6 border-t border-slate-800">
                {study.links.map((link) => {
                  const isGithub = link.url.includes("github.com");
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5 bg-transparent border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/5"
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
