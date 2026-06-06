"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Send, Mail, Github, Linkedin, CheckCircle, AlertCircle } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
  role: string;
  linkedin: string;
  hp_field: string; // Honeypot — hidden from real users
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
    role: "",
    linkedin: "",
    hp_field: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Enter a valid email address.";
    if (!form.subject.trim()) errors.subject = "Subject is required.";
    if (!form.message.trim()) errors.message = "Message is required.";
    else if (form.message.trim().length < 20)
      errors.message = "Please write a bit more (at least 20 characters).";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "", company: "", role: "", linkedin: "", hp_field: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setStatus("error");
      setErrorMsg(message);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-[var(--background)] border text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all duration-200";
  const inputNormal = `${inputBase} border-[var(--border)] focus:border-indigo-500/50 focus:ring-indigo-500/10`;
  const inputError = `${inputBase} border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10`;

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
          <p className="text-indigo-400 font-mono text-sm font-medium mb-2">08. Contact</p>
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
            className="space-y-8"
          >
            <p className="text-lg text-slate-300 leading-relaxed">
              Open to <span className="text-slate-100 font-medium">internships</span>,{" "}
              <span className="text-slate-100 font-medium">freelance projects</span>, and{" "}
              <span className="text-slate-100 font-medium">collaborations</span> — especially
              in full-stack product engineering, hybrid mobile, offline-first systems, EdTech, and AI-integrated applications.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:suryachalam18@gmail.com"
                id="contact-email-link"
                className="flex items-center gap-3 text-slate-400 hover:text-indigo-400 transition-colors group"
              >
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                  <Mail size={16} className="text-indigo-400" />
                </div>
                <span className="text-sm font-medium">suryachalam18@gmail.com</span>
              </a>
            </div>

            {/* Social links */}
            <div className="pt-6 border-t border-[var(--border)]">
              <p className="text-slate-500 text-sm mb-4">Find me on</p>
              <div className="flex gap-3">
                {[
                  {
                    href: "https://linkedin.com/in/suryachalam",
                    icon: <Linkedin size={18} />,
                    label: "LinkedIn",
                    id: "contact-linkedin-link",
                  },
                  {
                    href: "https://github.com/sgk18",
                    icon: <Github size={18} />,
                    label: "GitHub",
                    id: "contact-github-link",
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    id={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex items-center gap-2 p-3 rounded-xl card-bg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 text-sm"
                  >
                    {link.icon}
                    {link.label}
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
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-bg rounded-2xl p-10 flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Message received!</h3>
                <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                  I&apos;ll get back to you as soon as possible. You should receive a confirmation email shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors mt-2"
                >
                  Send another message →
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Honeypot field — hidden from real users */}
                <div aria-hidden="true" className="absolute opacity-0 pointer-events-none h-0 overflow-hidden">
                  <label htmlFor="hp_field">Do not fill this field</label>
                  <input
                    id="hp_field"
                    name="hp_field"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.hp_field}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1.5">
                      Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      className={fieldErrors.name ? inputError : inputNormal}
                    />
                    {fieldErrors.name && (
                      <p className="text-rose-400 text-xs mt-1">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1.5">
                      Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={fieldErrors.email ? inputError : inputNormal}
                    />
                    {fieldErrors.email && (
                      <p className="text-rose-400 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-400 mb-1.5">
                      Company <span className="text-slate-600">(Optional)</span>
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      placeholder="e.g. Microsoft"
                      value={form.company}
                      onChange={handleChange}
                      className={inputNormal}
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-400 mb-1.5">
                      Your Role <span className="text-slate-600">(Optional)</span>
                    </label>
                    <input
                      id="contact-role"
                      name="role"
                      type="text"
                      placeholder="e.g. Tech Recruiter"
                      value={form.role}
                      onChange={handleChange}
                      className={inputNormal}
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-slate-400 mb-1.5">
                      LinkedIn URL <span className="text-slate-600">(Optional)</span>
                    </label>
                    <input
                      id="contact-linkedin"
                      name="linkedin"
                      type="text"
                      placeholder="linkedin.com/in/..."
                      value={form.linkedin}
                      onChange={handleChange}
                      className={inputNormal}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-1.5">
                    Subject <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Internship opportunity / Project collaboration / ..."
                    value={form.subject}
                    onChange={handleChange}
                    className={fieldErrors.subject ? inputError : inputNormal}
                  />
                  {fieldErrors.subject && (
                    <p className="text-rose-400 text-xs mt-1">{fieldErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1.5">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell me about the opportunity or project..."
                    value={form.message}
                    onChange={handleChange}
                    className={`${fieldErrors.message ? inputError : inputNormal} resize-none`}
                  />
                  {fieldErrors.message && (
                    <p className="text-rose-400 text-xs mt-1">{fieldErrors.message}</p>
                  )}
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-rose-300 text-sm">{errorMsg || "Something went wrong. Please try again or email me directly."}</p>
                  </div>
                )}

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
