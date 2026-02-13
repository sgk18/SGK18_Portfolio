import Image from 'next/image';
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function About() {
  return (
    <section id="about" className="section bg-surface">
      <div className="container mx-auto px-6">
        <h2 className="section-title">About Me</h2>
        
        <div className="max-w-4xl mx-auto">
            {/* Bio */}
            <p className="text-lg text-text-secondary mb-8 leading-relaxed text-center md:text-left">
              Frontend Web Developer fresher with hands-on experience building responsive websites using HTML, CSS,
              JavaScript, and Next.js. Led and contributed to <span className="text-primary font-semibold">real-world projects</span> including official university websites
              and startup concepts. Actively seeking frontend or web development internship opportunities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-text-secondary">
                    <FaMapMarkerAlt className="text-primary text-xl" />
                    <span>Mahalakshmi Layout, Bengaluru – 560086</span>
                  </div>
                  <div className="flex items-center space-x-3 text-text-secondary">
                    <FaEnvelope className="text-primary text-xl" />
                    <a href="mailto:suryachalam18@gmail.com" className="hover:text-primary transition-colors">suryachalam18@gmail.com</a>
                  </div>
                  <div className="flex items-center space-x-3 text-text-secondary">
                    <FaPhone className="text-primary text-xl" />
                    <span>+91 98445 88551</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-6 md:justify-end">
                    <a href="https://linkedin.com/in/suryachalam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                        <FaLinkedin className="text-xl" />
                        <span>LinkedIn</span>
                    </a>
                    <a href="https://github.com/sgk18" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                        <FaGithub className="text-xl" />
                        <span>GitHub</span>
                    </a>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
                <div className="glass-card text-center p-6 border-l-4 border-primary">
                    <h3 className="text-4xl font-bold text-white mb-2">Fresher</h3>
                    <p className="text-text-secondary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent font-semibold">Experience Level</p>
                </div>
                <div className="glass-card text-center p-6 border-l-4 border-accent">
                    <h3 className="text-4xl font-bold text-white mb-2">10+</h3>
                    <p className="text-text-secondary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent font-semibold">Projects Completed</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
