import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VisitTracker from "@/components/providers/VisitTracker";
import ProjectsDirectory from "@/components/projects/ProjectsDirectory";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects | Surya",
  description:
    "Full archive of production platforms, hybrid mobile apps, and engineering projects by Suryachalam V M.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5F5]">
      <VisitTracker />
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="space-y-4">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#E3000F] hover:text-white transition-all"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
              <h1 className="font-black text-3xl md:text-5xl uppercase tracking-tight text-[#0A0A0A]">
                ALL PROJECTS
              </h1>
            </div>

            <p className="text-[#3a3a3a] font-medium max-w-2xl leading-relaxed">
              Filter by domain or search by stack. Featured systems include full engineering
              case studies with architecture and database ER diagrams.
            </p>
          </div>

          <ProjectsDirectory projects={projects} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
