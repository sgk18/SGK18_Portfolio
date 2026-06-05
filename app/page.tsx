import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Philosophy from "@/components/Philosophy";
import Timeline from "@/components/Timeline";
import ResumePreview from "@/components/ResumePreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";

export default function Home() {
  return (
    <main className="relative">
      <VisitTracker />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Philosophy />
      <Timeline />
      <ResumePreview />
      <Contact />
      <Footer />
    </main>
  );
}
