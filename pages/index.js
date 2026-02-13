import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Awards from '../components/Awards';
import Languages from '../components/Languages';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Suryachalam V M | Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main className="bg-background text-text-primary min-h-screen">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Awards />
        <Languages />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
