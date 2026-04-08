"use client";

import { Github, Linkedin, Code2, Heart } from "lucide-react";
import { smoothScrollTo } from "@/lib/smoothScroll";

const socials = [
  { href: "https://github.com/sgk18", icon: <Github size={18} />, label: "GitHub" },
  { href: "https://linkedin.com/in/yourprofile", icon: <Linkedin size={18} />, label: "LinkedIn" }, // TODO
];

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Code2 size={16} className="text-indigo-400" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Surya
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Building scalable web applications and exceptional digital experiences.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-slate-400 font-medium text-sm mb-4">Quick Links</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo(link.href);
                    }}
                    className="text-slate-500 hover:text-indigo-400 text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-slate-400 font-medium text-sm mb-4">Connect</p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-2.5 rounded-xl border border-[var(--border)] text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & bottom */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-sm">
          <p>
            © {currentYear}{" "}
            <span className="text-indigo-400 font-medium">Surya</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Designed & built with{" "}
            <Heart size={13} className="text-rose-500 fill-rose-500" />
            {" "}using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
