"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Send, Mail, Github, Linkedin } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Wire up to your preferred email service (e.g., Resend, EmailJS, Formspree)
    // Example with Formspree: await fetch("https://formspree.io/f/YOUR_ID", { ... })
    await new Promise((r) => setTimeout(r, 1200)); // Simulated delay
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200";

  return (
    <section id="contact" className="section-padding bg-[var(--card)]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">05. Contact</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Get in{" "}
            <span className="gradient-text">touch</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: message */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-slate-300 leading-relaxed">
              I&apos;m always open to discussing new opportunities, interesting projects, or
              just having a conversation about tech. Feel free to reach out — my inbox is
              always open!
            </p>

            <div className="space-y-4">
              <a
                href="mailto:suryachalam18@gmail.com"
                className="flex items-center gap-3 text-slate-400 hover:text-indigo-400 transition-colors group"
              >
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                  <Mail size={16} className="text-indigo-400" />
                </div>
                <span className="text-sm font-medium">suryachalam18@gmail.com</span>
              </a>
            </div>

            {/* Social links */}
            <div className="pt-4 border-t border-[var(--border)]">
              <p className="text-slate-500 text-sm mb-4">Find me on</p>
              <div className="flex gap-3">
                {[
                  {
                    href: "https://linkedin.com/in/suryachalam",
                    icon: <Linkedin size={18} />,
                    label: "LinkedIn",
                  },
                  {
                    href: "https://github.com/sgk18",
                    icon: <Github size={18} />,
                    label: "GitHub",
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="p-3 rounded-xl card-bg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Hi Surya, I'd love to chat about..."
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputBase} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
              >
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : status === "success" ? (
                  <>Message sent! I&apos;ll reply soon ✓</>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </button>

              {status === "error" && (
                <p className="text-rose-400 text-sm text-center">
                  Something went wrong. Please try again or email me directly.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
