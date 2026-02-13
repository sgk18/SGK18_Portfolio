import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export default function Projects() {
  const projects = [
    {
      title: 'Centre for Peace Praxis',
      description: 'Official website for Centre for Peace Praxis, improving usability and responsiveness.',
      tech: ['Next.js', 'React', 'Tailwind'],
      live: '#',
      github: '#',
    },
    {
      title: 'Techleons 2026',
      description: 'Unofficial Event Website built using Next.js with responsive component-based architecture.',
      tech: ['Next.js', 'React', 'CSS'],
      live: '#',
      github: '#',
    },
    {
      title: 'BottleStory',
      description: 'Startup-focused B2B branding website with conversion-driven UI and 3D customizer elements.',
      tech: ['React', 'Three.js', 'Tailwind'],
      live: '#',
      github: '#',
    },
    {
      title: 'Green Cart',
      description: 'Concept eco-friendly e-commerce platform promoting sustainable living.',
      tech: ['Next.js', 'Stripe', 'MongoDB'],
      live: '#',
      github: '#',
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio showcasing projects and frontend skills.',
      tech: ['Next.js', 'Framer Motion', 'Particles.js'],
      live: '#',
      github: '#',
    },
  ];

  return (
    <section id="projects" className="section bg-surface">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
                <div key={index} className="glass-card group hover:bg-surface/50 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 border border-white/5 hover:border-primary/30">
                    <div className="h-48 rounded-t-lg bg-gradient-to-br from-gray-900 to-black/50 flex items-center justify-center mb-4 group-hover:from-gray-800 group-hover:to-primary/10 transition-all duration-500 overflow-hidden relative">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span className="text-5xl font-bold text-gray-800 group-hover:text-primary transition-colors z-10">{project.title[0]}</span>
                    </div>
                    
                    <div className="flex-grow p-4">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-text-secondary mb-6 text-sm leading-relaxed line-clamp-3">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.map((t, i) => (
                                <span key={i} className="text-xs font-semibold px-3 py-1 bg-white/5 rounded-full text-primary border border-primary/20">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 pt-0 mt-auto flex gap-4">
                        <a href={project.live} className="flex-1 btn btn-primary py-2 text-sm flex items-center justify-center gap-2">
                            <span>Live Demo</span>
                            <FaExternalLinkAlt className="text-xs" />
                        </a>
                        <a href={project.github} className="flex-1 btn py-2 text-sm flex items-center justify-center gap-2 border-white/20 text-white hover:border-primary">
                            <FaGithub className="text-lg" />
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
