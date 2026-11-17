import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, ExternalLink, Github } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VisitTracker from "@/components/providers/VisitTracker";
import MermaidDiagram from "@/components/projects/MermaidDiagram";
import { caseStudies } from "@/data/caseStudies";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

const studyIds = Object.keys(caseStudies);

export function generateStaticParams() {
  return studyIds.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) {
    return { title: "Case Study Not Found | Surya" };
  }
  return {
    title: `${study.title} | Surya`,
    description: study.tagline,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = caseStudies[slug];

  if (!study) {
    notFound();
  }

  const currentIndex = studyIds.indexOf(slug);
  const prevSlug = currentIndex > 0 ? studyIds[currentIndex - 1] : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < studyIds.length - 1
      ? studyIds[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <VisitTracker />
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 md:px-12 lg:px-24">
        <article className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <header className="border-2 border-[#0A0A0A] bg-[#FFF5F5] p-6 sm:p-8 shadow-[6px_6px_0px_#0A0A0A] space-y-5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#E3000F] hover:text-white transition-all"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>All Projects</span>
            </Link>

            <div className="space-y-3">
              <p className="font-mono text-xs font-bold uppercase text-[#E3000F]">
                {study.role} · {study.period}
              </p>
              <h1 className="font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#0A0A0A] leading-tight">
                {study.title}
              </h1>
              <p className="text-base sm:text-lg font-medium text-[#3a3a3a] leading-relaxed">
                {study.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {study.links.map((link) => {
                const isGithub = link.label.toLowerCase().includes("github");
                return (
                  <a
                    key={link.url + link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-[#0A0A0A] text-xs font-bold uppercase shadow-[3px_3px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all ${
                      isGithub
                        ? "bg-white text-[#0A0A0A]"
                        : "bg-[#E3000F] text-white"
                    }`}
                  >
                    {isGithub ? <Github size={14} /> : <ExternalLink size={14} />}
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </header>

          {/* Problem / Motivation / Solution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[4px_4px_0px_#0A0A0A] space-y-3">
              <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
                The Problem
              </h2>
              <p className="text-sm font-medium text-[#3a3a3a] leading-relaxed">
                {study.problem}
              </p>
            </section>

            <section className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[4px_4px_0px_#0A0A0A] space-y-3">
              <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
                Motivation
              </h2>
              <p className="text-sm font-medium text-[#3a3a3a] leading-relaxed">
                {study.motivation}
              </p>
            </section>

            <section className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[4px_4px_0px_#0A0A0A] space-y-3">
              <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
                Solution
              </h2>
              <p className="text-sm font-medium text-[#3a3a3a] leading-relaxed">
                {study.solution}
              </p>
            </section>
          </div>

          {/* Architecture */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
              System Architecture
            </h2>
            <MermaidDiagram chart={study.architecture} id={`page-arch-${study.id}`} />
          </section>

          {/* Database Design */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
              Database Design
            </h2>
            <MermaidDiagram chart={study.databaseDesign} id={`page-db-${study.id}`} />
          </section>

          {/* Technologies Used */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
              Technologies &amp; Rationale
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {study.technologiesUsed.map((tech) => (
                <div
                  key={tech.name}
                  className="border-2 border-[#0A0A0A] bg-[#FFF5F5] p-5 shadow-[3px_3px_0px_#0A0A0A] space-y-1.5"
                >
                  <h3 className="font-black text-sm uppercase text-[#0A0A0A]">
                    {tech.name}
                  </h3>
                  <p className="text-sm font-medium text-[#3a3a3a] leading-relaxed">
                    {tech.why}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Challenges */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
              Technical Challenges
            </h2>
            <div className="space-y-4">
              {study.technicalChallenges.map((item, idx) => (
                <div
                  key={idx}
                  className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[4px_4px_0px_#0A0A0A] space-y-2"
                >
                  <h3 className="font-black text-base uppercase text-[#0A0A0A]">
                    {item.challenge}
                  </h3>
                  <p className="text-sm font-medium text-[#3a3a3a] leading-relaxed">
                    {item.resolution}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Lessons Learned & Future Improvements */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="border-2 border-[#0A0A0A] bg-[#FFF5F5] p-6 shadow-[4px_4px_0px_#0A0A0A] space-y-3">
              <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
                Lessons Learned
              </h2>
              <ul className="space-y-2.5 text-sm font-medium text-[#3a3a3a]">
                {study.lessonsLearned.map((lesson, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight
                      size={15}
                      className="text-[#E3000F] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-2 border-[#0A0A0A] bg-white p-6 shadow-[4px_4px_0px_#0A0A0A] space-y-3">
              <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E3000F]">
                Future Improvements
              </h2>
              <ul className="space-y-2.5 text-sm font-medium text-[#3a3a3a]">
                {study.futureImprovements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight
                      size={15}
                      className="text-[#E3000F] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Prev / Next */}
          <nav
            aria-label="Case study pagination"
            className="pt-6 border-t-2 border-[#0A0A0A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
          >
            {prevSlug ? (
              <Link
                href={`/projects/${prevSlug}`}
                className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-white px-4 py-3 font-mono text-xs font-bold uppercase text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFF5F5] transition-all"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                <span>{caseStudies[prevSlug].title.split("—")[0].trim()}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextSlug && (
              <Link
                href={`/projects/${nextSlug}`}
                className="inline-flex items-center justify-end gap-2 border-2 border-[#0A0A0A] bg-white px-4 py-3 font-mono text-xs font-bold uppercase text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#FFF5F5] transition-all"
              >
                <span>{caseStudies[nextSlug].title.split("—")[0].trim()}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </nav>
        </article>
      </main>

      <Footer />
    </div>
  );
}
