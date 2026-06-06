import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import GitHubStats from "@/components/GitHubStats";
import Philosophy from "@/components/Philosophy";
import ResumePreview from "@/components/ResumePreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden w-full">
      <VisitTracker />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <GitHubStats />
      <Philosophy />
      <ResumePreview />
      <Contact />
      <Footer />
    </main>
  );
}
