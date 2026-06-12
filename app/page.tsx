import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import VolunteerLeadership from "@/components/sections/VolunteerLeadership";
import Projects from "@/components/sections/Projects";
import GitHubStats from "@/components/sections/GitHubStats";
import Certifications from "@/components/sections/Certifications";
import Philosophy from "@/components/sections/Philosophy";
import ResumePreview from "@/components/sections/ResumePreview";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import VisitTracker from "@/components/providers/VisitTracker";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden w-full">
      <VisitTracker />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <VolunteerLeadership />
      <Projects />
      <GitHubStats />
      <Certifications />
      <Philosophy />
      <ResumePreview />
      <Contact />
      <Footer />
    </main>
  );
}
