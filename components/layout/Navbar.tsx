"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";

interface NavItem {
  readonly label: string;
  readonly href: string;
}

const navItems: readonly NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;

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
  }, [isHome]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && href.startsWith("#")) {
      e.preventDefault();
      smoothScrollTo(href);
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  const handleDownload = () => {
    fetch("/api/analytics/download", { method: "POST" }).catch(() => {});
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              smoothScrollTo("#");
            }
          }}
          className="flex items-center gap-1 font-black text-xl uppercase tracking-tighter text-[#0A0A0A] hover:opacity-80 transition-opacity"
        >
          <span>
            Surya<span className="text-[#E3000F]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Desktop Navigation">
          {navItems.map((item) => {
            const targetHref = isHome ? item.href : `/${item.href}`;
            const isActive = isHome
              ? activeSection === item.href.slice(1)
              : item.label === "Projects" && pathname.startsWith("/projects");

            return (
              <Link
                key={item.href}
                href={targetHref}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-xs uppercase font-bold text-[#0A0A0A] tracking-wider transition-all py-1 ${
                  isActive
                    ? "underline decoration-[#E3000F] decoration-[3px] underline-offset-4"
                    : "hover:underline hover:decoration-[#E3000F] hover:decoration-[3px] hover:underline-offset-4"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Resume CTA */}
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
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={mobileMenuOpen}
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
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.15 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b-2 border-[#0A0A0A] z-40 px-6 py-6 flex flex-col gap-4 shadow-[4px_4px_0px_#0A0A0A]"
          >
            {navItems.map((item) => {
              const targetHref = isHome ? item.href : `/${item.href}`;
              const isActive = isHome
                ? activeSection === item.href.slice(1)
                : item.label === "Projects" && pathname.startsWith("/projects");

              return (
                <Link
                  key={item.href}
                  href={targetHref}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-base uppercase font-black text-[#0A0A0A] py-2 border-b border-gray-200 ${
                    isActive ? "text-[#E3000F]" : "hover:text-[#E3000F]"
                  }`}
                >
                  {item.label}
                </Link>
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
