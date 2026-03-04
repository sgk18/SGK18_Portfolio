"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2 } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine active section
      const sections = navLinks.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
              <Code2 size={18} className="text-indigo-400" />
            </div>
            <span className="text-lg font-bold gradient-text">Surya</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeSection === link.href.slice(1)
                    ? "text-indigo-400"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {activeSection === link.href.slice(1) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="/resume.pdf"
              download
              className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-200"
            >
              Resume
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)]"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === link.href.slice(1)
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <a
                href="/resume.pdf"
                download
                className="mt-2 px-4 py-3 text-sm font-medium rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-center hover:bg-indigo-500/20 transition-all"
              >
                Download Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
