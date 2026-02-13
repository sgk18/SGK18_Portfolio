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
      description: 'Event website for Techleons 2026 technical fest.',
      tech: ['HTML', 'CSS', 'JS'],
      live: '#',
      github: '#',
    },
    {
      title: 'BottleStory',
      description: 'A 3D bottle customizer application.',
      tech: ['Three.js', 'React'],
      live: '#',
      github: '#',
    },
    {
      title: 'Green Cart',
      description: 'E-commerce platform for eco-friendly products.',
      tech: ['Next.js', 'Stripe'],
      live: '#',
      github: '#',
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio showcasing skills and projects.',
      tech: ['Next.js', 'Framer Motion'],
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
                <div key={index} className="glass-card group hover:bg-surface/50 transition-all duration-300 flex flex-col h-full">
                    <div className="h-48 rounded-t-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-4 group-hover:from-gray-800 group-hover:to-primary/20 transition-all duration-500">
                        <span className="text-4xl font-bold text-gray-700 group-hover:text-primary transition-colors">{project.title[0]}</span>
                    </div>
                    
                    <div className="flex-grow p-2">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-text-secondary mb-4 text-sm leading-relaxed">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.map((t, i) => (
                                <span key={i} className="text-xs font-semibold px-2 py-1 bg-background rounded-full text-primary border border-primary/30">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                        <a href={project.github} className="flex items-center space-x-2 text-sm text-text-secondary hover:text-white transition-colors">
                            <FaGithub className="text-lg" />
                            <span>Code</span>
                        </a>
                        <a href={project.live} className="flex items-center space-x-2 text-sm text-primary hover:text-accent transition-colors">
                            <span>Live Demo</span>
                            <FaExternalLinkAlt />
                        </a>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
