"use client";

import { Github, Linkedin, Code2, Heart } from "lucide-react";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";

const socials = [
  { href: "https://github.com/sgk18", icon: <Github size={18} />, label: "GitHub" },
  { href: "https://linkedin.com/in/suryachalam", icon: <Linkedin size={18} />, label: "LinkedIn" },
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
    <footer className="border-t-2 border-[#E3000F] bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 border border-white/20 bg-white/5 rounded-none">
                <Code2 size={16} className="text-[#E3000F]" />
              </div>
              <span className="font-black text-lg uppercase tracking-tighter text-white">
                Surya<span className="text-[#E3000F]">.</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building scalable web applications and exceptional digital experiences.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-[#E3000F] font-mono text-xs font-bold uppercase tracking-widest mb-4">Quick Links</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo(link.href);
                    }}
                    className="text-gray-400 hover:text-[#E3000F] text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-[#E3000F] font-mono text-xs font-bold uppercase tracking-widest mb-4">Connect</p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-2.5 border-2 border-white/20 hover:border-[#E3000F] bg-white/5 text-gray-400 hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 rounded-none shadow-[2px_2px_0px_rgba(255,255,255,0.1)] hover:shadow-[3px_3px_0px_#E3000F]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & bottom */}
        <div className="border-t border-[#333] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-xs font-mono">
          <p>
            © {currentYear}{" "}
            <span className="text-white font-bold uppercase tracking-wider">Surya</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Designed & built with{" "}
            <Heart size={13} className="text-[#E3000F] fill-[#E3000F]" />
            {" "}using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

