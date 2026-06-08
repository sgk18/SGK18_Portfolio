"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Menu, X } from "lucide-react";
import { smoothScrollTo } from "@/lib/smoothScroll";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      smoothScrollTo(href);
      setMobileMenuOpen(false);
    }
  };

  const handleDownload = () => {
    fetch('/api/analytics/download', { method: 'POST' }).catch(() => {});
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, "#")}
          className="flex items-center gap-2 font-black text-xl uppercase tracking-tighter text-[#0A0A0A] hover:opacity-85 transition-all"
        >
          <Code2 size={20} className="text-[#E3000F]" />
          <span>Surya<span className="text-[#E3000F]">.</span></span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Desktop Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-xs uppercase font-bold text-[#0A0A0A] tracking-wider transition-all py-1 ${
                  isActive 
                    ? "underline decoration-[#E3000F] decoration-[3px] underline-offset-4" 
                    : "hover:underline hover:decoration-[#E3000F] hover:decoration-[3px] hover:underline-offset-4"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          
          {/* Resume button */}
          <a
            href="/resume.pdf"
            download="Suryachalam_VM_Resume.pdf"
            onClick={handleDownload}
            className="bg-[#E3000F] text-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] 
                       hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] 
                       px-4 py-1.5 font-bold uppercase rounded-none transition-all text-xs tracking-wider"
          >
            Resume
          </a>
        </nav>

        {/* Mobile menu toggle button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#0A0A0A] transition-all rounded-none"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b-2 border-[#0A0A0A] z-40 px-6 py-6 flex flex-col gap-4 shadow-[4px_4px_0px_#0A0A0A]"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-base uppercase font-black text-[#0A0A0A] py-2 border-b border-gray-100 ${
                    isActive ? "text-[#E3000F]" : "hover:text-[#E3000F]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            
            <a
              href="/resume.pdf"
              download="Suryachalam_VM_Resume.pdf"
              onClick={handleDownload}
              className="bg-[#E3000F] text-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] 
                         hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] 
                         py-3 text-center font-bold uppercase rounded-none transition-all text-sm tracking-wider w-full mt-2"
            >
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

