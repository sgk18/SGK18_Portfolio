"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { Download, Eye, ExternalLink, FileText, Globe, Info } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function ResumePreview() {
  const ref = useRef(null);
  
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
    <section id="resume" className="section-padding bg-[#FFF5F5] border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">RESUME</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Panel: Info & Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_#0A0A0A] rounded-none space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 border-2 border-[#0A0A0A] bg-[#FFF5F5] text-[#E3000F] shadow-[2px_2px_0px_#0A0A0A] rounded-none">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-base text-[#0A0A0A]">Suryachalam V M</h3>
                    <p className="text-xs font-mono text-[#666666] font-bold">Compiled PDF Resume</p>
                  </div>
                </div>

                <p className="text-[#3a3a3a] text-sm font-medium leading-relaxed">
                  This document is compiled dynamically using pdfLaTeX and mirrors the actual structure, coursework, experience, and accomplishments of my career.
                </p>

                {/* View Selector Buttons */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#0A0A0A] font-bold block">Preview Method</span>
                  <div className="grid grid-cols-2 gap-2 p-1 border-2 border-[#0A0A0A] bg-[#FFF5F5] rounded-none">
                    <button
                      onClick={() => setViewerType("local")}
                      className={`px-3 py-2 rounded-none text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        viewerType === "local"
                          ? "bg-[#E3000F] text-white shadow-[2px_2px_0px_#0A0A0A] border-2 border-[#0A0A0A]"
                          : "text-[#0A0A0A] hover:bg-white/50"
                      }`}
                    >
                      Direct PDF
                    </button>
                    <button
                      onClick={() => setViewerType("google")}
                      className={`px-3 py-2 rounded-none text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        viewerType === "google"
                          ? "bg-[#E3000F] text-white shadow-[2px_2px_0px_#0A0A0A] border-2 border-[#0A0A0A]"
                          : "text-[#0A0A0A] hover:bg-white/50"
                      }`}
                    >
                      Google Preview
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t-2 border-[#0A0A0A]">
                  <a
                    href="/resume.pdf"
                    download="Suryachalam_VM_Resume.pdf"
                    onClick={() => fetch('/api/analytics/download', { method: 'POST' }).catch(() => {})}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-[#0A0A0A] bg-[#E3000F] hover:bg-[#FF1A1A] text-white font-bold uppercase shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5.5px_5.5px_0px_#0A0A0A] transition-all rounded-none text-sm tracking-wider"
                  >
                    <Download size={16} />
                    Download Resume
                  </a>
                  <a
                    href={`/resume.pdf?v=${pdfVersion}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-[#0A0A0A] bg-white hover:bg-[#FFF5F5] text-[#0A0A0A] font-bold uppercase shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5.5px_5.5px_0px_#0A0A0A] transition-all rounded-none text-sm tracking-wider"
                  >
                    <Eye size={16} />
                    View Full Screen
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Helper Notice for Google View on Localhost */}
              {viewerType === "google" && isLocalDev && (
                <div className="flex gap-3 p-4 border-2 border-[#0A0A0A] bg-[#FFF5F5] text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] rounded-none text-xs leading-relaxed font-mono">
                  <Info size={16} className="shrink-0 text-[#E3000F] mt-0.5" />
                  <p>
                    <strong>Note:</strong> You are on <code>localhost</code>. The Google Docs preview is pointing to the deployed version on Vercel as Google cannot fetch files from local development environments.
                  </p>
                </div>
              )}
            </div>

            {/* Right Panel: Embedded Previewer */}
            <div className="lg:col-span-8 w-full">
              {/* Desktop / Tablet Iframe Container */}
              <div className="hidden sm:block w-full aspect-[1/1.414] border-2 border-[#0A0A0A] bg-white shadow-[6px_6px_0px_#0A0A0A] rounded-none relative overflow-hidden">
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
              <div className="block sm:hidden border-2 border-[#0A0A0A] bg-white p-8 text-center space-y-6 shadow-[5px_5px_0px_#0A0A0A] rounded-none">
                <div className="w-16 h-16 mx-auto border-2 border-[#0A0A0A] bg-[#FFF5F5] text-[#E3000F] shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center rounded-none">
                  <Globe size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black uppercase text-lg text-[#0A0A0A]">Optimized Mobile CV</h3>
                  <p className="text-[#3a3a3a] text-xs font-medium max-w-sm mx-auto leading-relaxed">
                    Mobile devices render PDF embed files as direct downloads or with restricted styling. Download the optimized document or view it directly in your browser.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <a
                    href="/resume.pdf"
                    download="Suryachalam_VM_Resume.pdf"
                    onClick={() => fetch('/api/analytics/download', { method: 'POST' }).catch(() => {})}
                    className="flex items-center justify-center gap-2 px-5 py-4 border-2 border-[#0A0A0A] bg-[#E3000F] text-white font-bold uppercase shadow-[3px_3px_0px_#0A0A0A] text-sm rounded-none"
                  >
                    <Download size={16} />
                    Download Resume (PDF)
                  </a>
                  <a
                    href={`/resume.pdf?v=${pdfVersion}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-4 border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] font-bold uppercase shadow-[3px_3px_0px_#0A0A0A] text-sm rounded-none"
                  >
                    <Eye size={16} />
                    View PDF Directly
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
