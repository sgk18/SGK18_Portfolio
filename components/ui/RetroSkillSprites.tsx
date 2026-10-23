"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Sparkles,
  Layers,
  Terminal as TerminalIcon,
  Cpu,
  Code,
  FileCode,
  Activity,
  Zap,
} from "lucide-react";

type BadgeId = "react" | "nextjs" | "typescript" | "ai" | "terminal";

interface BadgeData {
  id: BadgeId;
  name: string;
  tagline: string;
  category: string;
  level: string;
  power: number;
  color: string;
  accentHex: string;
  icon: React.ReactNode;
  lore: string;
  techFocus: string[];
  files: {
    aseprite: string;
    sheetPng: string;
    sheetJson: string;
    gif: string;
  };
}

const BADGES: BadgeData[] = [
  {
    id: "react",
    name: "React 19",
    tagline: "Atomic Reactive Engine",
    category: "UI Architecture",
    level: "Lv. 98 · Master",
    power: 98,
    color: "from-cyan-500/20 to-sky-500/10",
    accentHex: "#00D8FF",
    icon: <Code size={16} className="text-[#00D8FF]" />,
    lore: "Pulsing atomic core with revolving electron rings and quantum state listeners. Architected for zero unnecessary re-renders, concurrent transitions, and buttery-smooth 60fps interactive UIs.",
    techFocus: ["Custom Hooks", "Concurrent Features", "Framer Motion", "Server Components"],
    files: {
      aseprite: "/sprites/react.aseprite",
      sheetPng: "/sprites/react_sheet.png",
      sheetJson: "/sprites/react_sheet.json",
      gif: "/sprites/react.gif",
    },
  },
  {
    id: "nextjs",
    name: "Next.js 16",
    tagline: "Monochrome Laser Prism",
    category: "Full-Stack Framework",
    level: "Lv. 96 · Production",
    power: 96,
    color: "from-red-500/20 to-neutral-500/10",
    accentHex: "#E3000F",
    icon: <Zap size={16} className="text-[#E3000F]" />,
    lore: "High-contrast bevel badge channeling crimson laser energy along the diagonal vector. Driving App Router, Edge runtime functions, optimized image pipelines, and lightning-fast server rendering.",
    techFocus: ["App Router", "Server Actions", "Edge Middleware", "Static ISR / Hybrid"],
    files: {
      aseprite: "/sprites/nextjs.aseprite",
      sheetPng: "/sprites/nextjs_sheet.png",
      sheetJson: "/sprites/nextjs_sheet.json",
      gif: "/sprites/nextjs.gif",
    },
  },
  {
    id: "typescript",
    name: "TypeScript 5.9",
    tagline: "Solid-State ROM Cartridge",
    category: "Type Safety",
    level: "Lv. 95 · Strict",
    power: 95,
    color: "from-blue-600/20 to-indigo-600/10",
    accentHex: "#3178C6",
    icon: <FileCode size={16} className="text-[#3178C6]" />,
    lore: "Retro 16-bit arcade cartridge with 5 gold contact pins and glowing cyan data buses. Eliminating runtime errors with strict compile-time types, generic utilities, and enterprise-grade schemas.",
    techFocus: ["Strict Mode", "Generics & Unions", "Zod Validation", "End-to-End Safety"],
    files: {
      aseprite: "/sprites/typescript.aseprite",
      sheetPng: "/sprites/typescript_sheet.png",
      sheetJson: "/sprites/typescript_sheet.json",
      gif: "/sprites/typescript.gif",
    },
  },
  {
    id: "ai",
    name: "AI & Neural Core",
    tagline: "Cyberpunk Synapse Matrix",
    category: "Intelligent Systems",
    level: "Lv. 92 · Integrated",
    power: 92,
    color: "from-purple-600/20 to-fuchsia-600/10",
    accentHex: "#9D4EDD",
    icon: <Cpu size={16} className="text-[#9D4EDD]" />,
    lore: "Levitating hexagonal cyber-deck pulsing with synaptic neon arcs between nodes. Powering semantic vector search, intelligent agent pipelines, LLM prompt orchestration, and autonomous tooling.",
    techFocus: ["RAG Pipelines", "Embedding Models", "Agentic Workflows", "Vector DBs"],
    files: {
      aseprite: "/sprites/ai.aseprite",
      sheetPng: "/sprites/ai_sheet.png",
      sheetJson: "/sprites/ai_sheet.json",
      gif: "/sprites/ai.gif",
    },
  },
  {
    id: "terminal",
    name: "Terminal & DevOps",
    tagline: "Phosphor CRT Workstation",
    category: "Systems & Infrastructure",
    level: "Lv. 97 · Native",
    power: 97,
    color: "from-emerald-500/20 to-green-600/10",
    accentHex: "#00FF66",
    icon: <TerminalIcon size={16} className="text-[#00FF66]" />,
    lore: "Cathode-ray monitor with green phosphor scanlines, blinking block cursor, and power LED. Home of Git hooks, Linux containers, Docker images, CI/CD automation, and cloud deployment pipelines.",
    techFocus: ["Bash & Linux", "Docker Containers", "Git Workflows", "OCI & Cloud CI/CD"],
    files: {
      aseprite: "/sprites/terminal.aseprite",
      sheetPng: "/sprites/terminal_sheet.png",
      sheetJson: "/sprites/terminal_sheet.json",
      gif: "/sprites/terminal.gif",
    },
  },
];

export default function RetroSkillSprites() {
  const [selectedId, setSelectedId] = useState<BadgeId>("react");
  const [scanlines, setScanlines] = useState(true);
  const [scaleFactor, setScaleFactor] = useState<number>(3); // 3x, 4x

  const currentBadge = BADGES.find((b) => b.id === selectedId) || BADGES[0];

  return (
    <div className="border-2 border-[#0A0A0A] bg-white p-6 md:p-8 shadow-[6px_6px_0px_#0A0A0A] mb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b-2 border-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight text-[#0A0A0A]">
                Retro 2D Sprites Vault
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase bg-[#0A0A0A] text-white px-2 py-0.5 border border-[#0A0A0A]">
                ASEPRITE NATIVE
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-600 font-semibold mt-0.5">
              Authentic 32×32 pixel art sprites with animated loops, .aseprite source & sprite sheets
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Scanline toggle */}
          <button
            onClick={() => setScanlines((prev) => !prev)}
            className={`px-2.5 py-1 text-xs font-mono font-bold border-2 border-[#0A0A0A] transition-all cursor-pointer ${
              scanlines
                ? "bg-[#0A0A0A] text-white shadow-[2px_2px_0px_#E3000F]"
                : "bg-neutral-100 text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]"
            }`}
            title="Toggle CRT Scanline Effect"
          >
            CRT SCANLINES: {scanlines ? "ON" : "OFF"}
          </button>

          {/* Scale toggle */}
          <button
            onClick={() => setScaleFactor((prev) => (prev === 3 ? 4 : 3))}
            className="px-2.5 py-1 text-xs font-mono font-bold border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-neutral-100 transition-all cursor-pointer"
            title="Toggle Pixel Zoom Scale"
          >
            SCALE: {scaleFactor}×
          </button>

          {/* Master Aseprite Download */}
          <a
            href="/sprites/developer_badges.aseprite"
            download="developer_badges.aseprite"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#E3000F] text-white font-mono text-xs font-bold border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A0A0A] transition-all"
            title="Download Master .aseprite file with all 5 badges & tags"
          >
            <Download size={13} />
            <span>.ASEPRITE (ALL)</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Selector Chips on Top, Detailed HUD + Live View Below */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {BADGES.map((badge) => {
          const isSelected = badge.id === selectedId;
          return (
            <button
              key={badge.id}
              onClick={() => setSelectedId(badge.id)}
              className={`flex items-center gap-3 p-2.5 border-2 border-[#0A0A0A] text-left transition-all cursor-pointer rounded-none relative ${
                isSelected
                  ? "bg-[#FFF5F5] shadow-[4px_4px_0px_#E3000F] -translate-x-0.5 -translate-y-0.5"
                  : "bg-white shadow-[3px_3px_0px_#0A0A0A] hover:bg-neutral-50 hover:-translate-x-0.5 hover:-translate-y-0.5"
              }`}
            >
              {/* Miniature pixel sprite preview */}
              <div
                className="w-8 h-8 shrink-0 bg-[#0A0A0A] border border-[#0A0A0A] flex items-center justify-center overflow-hidden"
                style={{ imageRendering: "pixelated" }}
              >
                <img
                  src={badge.files.gif}
                  alt={badge.name}
                  className="w-8 h-8"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              <div className="min-w-0">
                <span className="block font-black text-xs uppercase tracking-tight text-[#0A0A0A] truncate">
                  {badge.name.split(" ")[0]}
                </span>
                <span className="block font-mono text-[10px] text-neutral-500 font-bold truncate">
                  {badge.level.split("·")[0]}
                </span>
              </div>

              {isSelected && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E3000F] border border-[#0A0A0A]" />
              )}
            </button>
          );
        })}
      </div>

      {/* HUD Inspect Deck */}
      <div className="border-2 border-[#0A0A0A] bg-[#0A0A0A] text-white p-5 md:p-6 shadow-[5px_5px_0px_#0A0A0A] relative overflow-hidden">
        {/* Background CRT scanlines overlay if enabled */}
        {scanlines && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 2px)",
            }}
          />
        )}

        <div className="relative z-20 grid md:grid-cols-12 gap-6 items-center">
          {/* Left: Pixel Art Display Screen */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#050505] border-2 border-neutral-700 relative">
            {/* Screen bezel header */}
            <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-neutral-800 text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping inline-block" />
                FRAME BUFFER: 32×32 PX
              </span>
              <span>150MS LOOP</span>
            </div>

            {/* Scaled Pixel Art Canvas View */}
            <div
              className="relative p-4 border border-neutral-800 bg-[#0B0F19] flex items-center justify-center shadow-inner"
              style={{
                width: scaleFactor === 3 ? "144px" : "180px",
                height: scaleFactor === 3 ? "144px" : "180px",
              }}
            >
              <img
                key={currentBadge.id}
                src={currentBadge.files.gif}
                alt={currentBadge.name}
                className="transition-transform duration-200"
                style={{
                  width: `${32 * scaleFactor}px`,
                  height: `${32 * scaleFactor}px`,
                  imageRendering: "pixelated",
                }}
              />

              {/* Sub-pixel reticle corners */}
              <span className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-neutral-600" />
              <span className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-neutral-600" />
              <span className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-neutral-600" />
              <span className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-neutral-600" />
            </div>

            {/* Spec readout under sprite */}
            <div className="mt-4 flex items-center justify-between w-full font-mono text-[11px] text-neutral-400">
              <span className="text-[#00FF66] font-bold">STATUS: ACTIVE</span>
              <span>4 FRAMES · LOOP</span>
              <span style={{ color: currentBadge.accentHex }} className="font-bold">
                {currentBadge.level}
              </span>
            </div>
          </div>

          {/* Right: Detailed Lore, Power Gauge & Asset Downloads */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Badge Title & Category */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1">
                    {currentBadge.icon}
                    {currentBadge.category}
                  </span>
                  <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    {currentBadge.name}
                  </h4>
                  <p className="font-mono text-xs text-[#E3000F] font-bold mt-0.5">
                    {currentBadge.tagline}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-neutral-400 block">EFFICIENCY</span>
                  <span className="text-2xl font-mono font-black text-white">
                    {currentBadge.power}%
                  </span>
                </div>
              </div>

              {/* Neobrutalist Power Gauge Bar */}
              <div className="w-full bg-neutral-900 border border-neutral-700 h-3 mb-4 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentBadge.power}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-[#E3000F]"
                  style={{ backgroundColor: currentBadge.accentHex }}
                />
              </div>

              {/* Lore description */}
              <p className="text-neutral-300 text-sm leading-relaxed mb-4 font-normal">
                {currentBadge.lore}
              </p>

              {/* Tech Focus Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {currentBadge.techFocus.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[11px] font-bold px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300"
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Asset Export Action Bar */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-neutral-400 font-bold uppercase mr-1">
                EXPORTS:
              </span>

              {/* .aseprite native file download */}
              <a
                href={currentBadge.files.aseprite}
                download={`${currentBadge.id}.aseprite`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#0A0A0A] font-mono text-xs font-bold border border-white hover:bg-[#E3000F] hover:text-white hover:border-[#E3000F] transition-all"
                title={`Download ${currentBadge.name} .aseprite source file`}
              >
                <Download size={13} />
                <span>.ASEPRITE</span>
              </a>

              {/* PNG Sprite Sheet */}
              <a
                href={currentBadge.files.sheetPng}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-neutral-200 font-mono text-xs font-bold border border-neutral-700 hover:border-neutral-500 hover:text-white transition-all"
                title="View & Download PNG Sprite Sheet"
              >
                <Layers size={13} />
                <span>SPRITE SHEET (PNG)</span>
              </a>

              {/* JSON Metadata */}
              <a
                href={currentBadge.files.sheetJson}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-neutral-200 font-mono text-xs font-bold border border-neutral-700 hover:border-neutral-500 hover:text-white transition-all"
                title="View Sprite JSON Coordinates & Tags"
              >
                <FileCode size={13} />
                <span>JSON DATA</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
