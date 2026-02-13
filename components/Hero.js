import { useEffect, useState } from 'react';
import { loadSlim } from "@tsparticles/slim"; 
import Particles, { initParticlesEngine } from "@tsparticles/react";
import Link from 'next/link';

export default function Hero() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#00f3ff",
      },
      links: {
        color: "#00f3ff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {init && (
            <Particles
                id="tsparticles"
                options={particlesOptions}
                className="absolute inset-0 z-0"
            />
        )}
      
      <div className="absolute inset-0 z-0 opacity-20">
         <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/public/Minimalist_Mathematical_Graph_Animation.mp4" type="video/mp4" />
         </video>
      </div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 glitch" data-text="Hello, I’m Suryachalam V M">
          Hello, I’m Suryachalam V M
        </h1>
        <p className="text-xl md:text-3xl text-text-secondary mb-8">
          Frontend Web Developer Intern
        </p>
        <div className="flex justify-center space-x-6">
          <Link href="#projects" className="btn btn-primary">
            View Projects
          </Link>
          <Link href="#contact" className="btn">
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
}
