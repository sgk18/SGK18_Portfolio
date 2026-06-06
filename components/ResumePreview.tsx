"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { Download, Eye, ExternalLink, FileText, Globe, Info } from "lucide-react";

export default function ResumePreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  
  const [viewerType, setViewerType] = useState<"local" | "google">("local");
  const [origin, setOrigin] = useState("");
  const [pdfVersion, setPdfVersion] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      queueMicrotask(() => {
        setOrigin(window.location.origin);
        setPdfVersion(Date.now());
      });
    }
  }, []);

  // Compute Google Docs viewer URL based on current deployment
  // Falling back to the Vercel domain if on localhost
  const publicPdfUrl = origin.includes("localhost") || origin.includes("127.0.0.1")
    ? `https://sgk-18-portfolio.vercel.app/resume.pdf?v=${pdfVersion}`
    : `${origin}/resume.pdf?v=${pdfVersion}`;

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(publicPdfUrl)}&embedded=true`;
  const isLocalDev = origin.includes("localhost") || origin.includes("127.0.0.1");

  return (
    <section id="resume" className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">07. Resume</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Interactive{" "}
            <span className="gradient-text">Preview</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Info & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="card-bg rounded-2xl p-6 border border-indigo-500/10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">Suryachalam V M</h3>
                  <p className="text-xs text-slate-400">Compiled PDF Resume</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                This document is compiled dynamically using pdfLaTeX and mirrors the actual structure, coursework, experience, and accomplishments of my career.
              </p>

              {/* View Selector Buttons */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block">Preview Method</span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <button
                    onClick={() => setViewerType("local")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      viewerType === "local"
                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/15"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Direct PDF
                  </button>
                  <button
                    onClick={() => setViewerType("google")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      viewerType === "google"
                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/15"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Google Preview
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <a
                  href="/resume.pdf"
                  download="Suryachalam_VM_Resume.pdf"
                  onClick={() => fetch('/api/analytics/download', { method: 'POST' }).catch(() => {})}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5"
                >
                  <Download size={16} />
                  Download Resume
                </a>
                <a
                  href={`/resume.pdf?v=${pdfVersion}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-800 text-slate-300 font-semibold text-sm hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Eye size={16} />
                  View Full Screen
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Helper Notice for Google View on Localhost */}
            {viewerType === "google" && isLocalDev && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs leading-relaxed"
              >
                <Info size={16} className="shrink-0 text-indigo-400" />
                <p>
                  <strong>Note:</strong> You are on <code>localhost</code>. The Google Docs preview is pointing to the deployed version on Vercel as Google cannot fetch files from local development environments.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Panel: Embedded Previewer */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8 w-full"
          >
            {/* Desktop / Tablet Iframe Container */}
            <div className="hidden sm:block w-full aspect-[1/1.414] rounded-2xl overflow-hidden border border-slate-800 bg-[#09090e] shadow-2xl relative">
              <AnimatePresence mode="wait">
                {viewerType === "local" ? (
                  <motion.iframe
                    key="local-pdf"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={`/resume.pdf?v=${pdfVersion}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-full border-0"
                    title="Suryachalam V M Resume Local PDF Viewer"
                  />
                ) : (
                  <motion.iframe
                    key="google-pdf"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={googleViewerUrl}
                    className="w-full h-full border-0"
                    title="Suryachalam V M Resume Google Docs PDF Viewer"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Mobile-Friendly Mockup and Action Card (Hidden on Desktop) */}
            <div className="block sm:hidden card-bg rounded-2xl border border-slate-800 p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Globe size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-slate-100">Optimized Mobile CV</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Mobile devices render PDF embed files as direct downloads or with restricted styling. Download the optimized document or view it directly in your browser.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2">
                <a
                  href="/resume.pdf"
                  download="Suryachalam_VM_Resume.pdf"
                  onClick={() => fetch('/api/analytics/download', { method: 'POST' }).catch(() => {})}
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-indigo-500 text-white font-semibold text-sm"
                >
                  <Download size={16} />
                  Download Resume (PDF)
                </a>
                <a
                  href={`/resume.pdf?v=${pdfVersion}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl border border-slate-800 text-slate-300 font-semibold text-sm"
                >
                  <Eye size={16} />
                  View PDF Directly
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
