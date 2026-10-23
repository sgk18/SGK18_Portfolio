"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Send, Mail, Phone, Github, Linkedin, CheckCircle, AlertCircle } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

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
    "w-full px-4 py-3 border-2 border-[#0A0A0A] bg-[#FFF5F5] font-medium text-sm text-[#0A0A0A] placeholder-[#888] focus:outline-none focus:border-[#E3000F] focus:shadow-[4px_4px_0px_#E3000F] transition-all rounded-none";
  const inputNormal = `${inputBase}`;
  const inputError = `${inputBase} border-[#E3000F] shadow-[4px_4px_0px_#E3000F]`;

  return (
    <section id="contact" className="section-padding bg-white border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section title */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">GET IN TOUCH</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: message */}
            <div className="space-y-8 text-[#0A0A0A]">
              <p className="text-lg font-medium leading-relaxed">
                Open to <span className="underline decoration-[#E3000F] decoration-2 font-bold">internships</span>,{" "}
                <span className="underline decoration-[#E3000F] decoration-2 font-bold">freelance projects</span>, and{" "}
                <span className="underline decoration-[#E3000F] decoration-2 font-bold">collaborations</span> — especially
                in full-stack product engineering, hybrid mobile, offline-first systems, EdTech, and AI-integrated applications.
              </p>

              <div className="space-y-4 flex flex-col">
                <a
                  href="mailto:suryachalam18@gmail.com"
                  id="contact-email-link"
                  className="flex items-center gap-3 p-4 border-2 border-[#0A0A0A] bg-white shadow-[3px_3px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all rounded-none group w-fit"
                >
                  <div className="p-2 border-2 border-[#0A0A0A] bg-[#FFF5F5] text-[#E3000F] rounded-none group-hover:bg-[#E3000F] group-hover:text-white transition-colors shadow-[1.5px_1.5px_0px_#0A0A0A]">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">suryachalam18@gmail.com</span>
                </a>

                <a
                  href="tel:+919844588551"
                  id="contact-phone-link"
                  className="flex items-center gap-3 p-4 border-2 border-[#0A0A0A] bg-white shadow-[3px_3px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all rounded-none group w-fit"
                >
                  <div className="p-2 border-2 border-[#0A0A0A] bg-[#FFF5F5] text-[#E3000F] rounded-none group-hover:bg-[#E3000F] group-hover:text-white transition-colors shadow-[1.5px_1.5px_0px_#0A0A0A]">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">+91 98445 88551</span>
                </a>
              </div>

              {/* Social links */}
              <div className="pt-6 border-t-2 border-[#0A0A0A]">
                <p className="text-[#666666] font-mono text-xs font-bold uppercase tracking-wider mb-4">Find me on</p>
                <div className="flex flex-wrap gap-3">
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
                      className="flex items-center gap-2 p-3 border-2 border-[#0A0A0A] bg-white shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFF5F5] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all rounded-none text-xs font-black uppercase tracking-wider"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="contact-form">
              {status === "success" ? (
                <div className="border-2 border-[#0A0A0A] bg-white p-8 sm:p-10 flex flex-col items-center text-center gap-4 shadow-[6px_6px_0px_#0A0A0A] rounded-none animate-in fade-in duration-200">
                  {/* 2D Sprite Animated Mail Delivery */}
                  <div className="relative p-3 border-2 border-[#0A0A0A] bg-[#FFF5F5] shadow-[4px_4px_0px_#0A0A0A] flex items-center justify-center">
                    <img
                      src="/sprites/message_sent.gif"
                      alt="Message Dispatched"
                      width={80}
                      height={80}
                      className="w-20 h-20 [image-rendering:pixelated] select-none"
                    />
                    <span className="absolute -top-2.5 -right-2.5 bg-[#10B981] text-white border-2 border-[#0A0A0A] font-mono text-[10px] font-black px-1.5 py-0.5 shadow-[2px_2px_0px_#0A0A0A]">
                      SENT · OK
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#0A0A0A]">
                      Transmission Dispatched!
                    </h3>
                    <p className="font-mono text-xs text-[#E3000F] font-bold mt-1">
                      CONNECTION REQUEST RECEIVED
                    </p>
                  </div>

                  <p className="text-[#3a3a3a] text-sm font-medium max-w-sm leading-relaxed">
                    Thank you for reaching out! Your message is safely in my inbox, and a confirmation email has been routed to you. I&apos;ll reply shortly.
                  </p>

                  <button
                    onClick={() => setStatus("idle")}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFF5F5] hover:text-[#E3000F] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all cursor-pointer mt-2"
                  >
                    <span>← Send Another Message</span>
                  </button>
                </div>
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
                      <label htmlFor="name" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
                        Name <span className="text-[#E3000F] font-bold">*</span>
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
                        <p className="text-[#E3000F] text-xs font-mono font-bold mt-1.5">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
                        Email <span className="text-[#E3000F] font-bold">*</span>
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
                        <p className="text-[#E3000F] text-xs font-mono font-bold mt-1.5">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
                        Company <span className="text-[#666666]">(Optional)</span>
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
                      <label htmlFor="role" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
                        Your Role <span className="text-[#666666]">(Optional)</span>
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
                      <label htmlFor="linkedin" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
                        LinkedIn URL <span className="text-[#666666]">(Optional)</span>
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
                    <label htmlFor="subject" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
                      Subject <span className="text-[#E3000F] font-bold">*</span>
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
                      <p className="text-[#E3000F] text-xs font-mono font-bold mt-1.5">{fieldErrors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">
                      Message <span className="text-[#E3000F] font-bold">*</span>
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
                      <p className="text-[#E3000F] text-xs font-mono font-bold mt-1.5">{fieldErrors.message}</p>
                    )}
                  </div>

                  {status === "error" && (
                    <div className="flex items-start gap-3 p-4 border-2 border-[#0A0A0A] bg-[#FFF5F5] text-[#0A0A0A] rounded-none">
                      <AlertCircle size={16} className="text-[#E3000F] shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{errorMsg || "Something went wrong. Please try again or email me directly."}</p>
                    </div>
                  )}

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 contact-submit hover:bg-[#FF1A1A] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed font-bold uppercase shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#0A0A0A] transition-all rounded-none cursor-pointer text-sm tracking-wider"
                    aria-live="polite"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message →
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
