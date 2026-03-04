"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import PillNav from "./PillNav";
import StaggeredMenu from "./StaggeredMenu";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const staggeredItems = navItems.map((item) => ({
  label: item.label,
  ariaLabel: `Go to ${item.label} section`,
  link: item.href,
}));

const socialItems = [
  { label: "GitHub", link: "https://github.com/sgk18" },
  { label: "LinkedIn", link: "https://linkedin.com/in/yourprofile" },
];

const LogoIcon = (
  <div className="flex items-center gap-2">
    <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
      <Code2 size={16} className="text-indigo-400" />
    </div>
    <span className="text-base font-bold gradient-text">Surya</span>
  </div>
);

const SmallLogoIcon = (
  <div className="flex items-center justify-center w-full h-full">
    <Code2 size={18} className="text-indigo-400" />
  </div>
);

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeHref = activeSection ? `#${activeSection}` : "";

  return (
    <>
      {/* -- Desktop nav (PillNav, md+) --------------------------- */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 pt-4 pb-2 pointer-events-none hidden md:block"
      >
        <div className="relative flex items-center justify-center pointer-events-auto px-4">
          <PillNav
            logo={SmallLogoIcon}
            items={navItems}
            activeHref={activeHref}
            baseColor="#12121a"
            pillColor="#1e1e2e"
            hoveredPillTextColor="#6366f1"
            pillTextColor="#94a3b8"
            ease="power3.out"
            initialLoadAnimation={true}
          />
          <a
            href="/resume.pdf"
            download
            className="hidden md:inline-flex items-center ml-3 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-400 border border-indigo-500/30 bg-[#12121a] hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all duration-200 whitespace-nowrap flex-shrink-0"
            style={{ height: "42px" }}
          >
            Resume
          </a>
        </div>
      </motion.header>

      {/* -- Mobile nav (StaggeredMenu, <md) --------------------- */}
      <div className="md:hidden">
        <StaggeredMenu
          position="right"
          items={staggeredItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          logo={LogoIcon}
          menuButtonColor="#e2e8f0"
          openMenuButtonColor="#6366f1"
          changeMenuColorOnOpen={true}
          colors={["#1a1a2e", "#0f0f18"]}
          accentColor="#6366f1"
          isFixed={true}
          closeOnClickAway={true}
        />
      </div>
    </>
  );
}
