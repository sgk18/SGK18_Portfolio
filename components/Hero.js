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
      
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 bg-background/80"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            
            {/* Left Column: Profile Photo */}
            <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full overflow-hidden border-4 border-primary shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                <img 
                    src="/profile.jpg" 
                    alt="Suryachalam V M" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right Column: Text & Buttons */}
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 glitch" data-text="Hello, I’m Suryachalam V M">
                Hello, I’m Suryachalam V M
                </h1>
                <p className="text-xl md:text-2xl text-primary font-semibold mb-4">
                Frontend Web Developer Intern
                </p>
                <p className="text-text-secondary mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Building responsive, user-centric web experiences with modern tech. Passionate about clean code and creative solutions.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                    <Link href="#projects" className="btn btn-primary">
                        View Projects
                    </Link>
                    <Link href="#contact" className="btn">
                        Contact Me
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
