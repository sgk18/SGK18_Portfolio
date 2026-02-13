import Image from 'next/image';
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function About() {
  return (
    <section id="about" className="section bg-surface">
      <div className="container mx-auto px-6">
        <h2 className="section-title">About Me</h2>
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/3 relative group">
             <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-primary shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-transform duration-500 group-hover:scale-105">
                <Image 
                  src="/profile.jpg" 
                  alt="Suryachalam V M" 
                  layout="fill" 
                  objectFit="cover" 
                />
             </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Frontend Web Developer fresher with hands-on experience building responsive websites using HTML, CSS,
              JavaScript, and Next.js. Led and contributed to <span className="text-primary font-semibold">real-world projects</span> including official university websites
              and startup concepts. Actively seeking frontend or web development internship opportunities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 text-text-secondary">
                <FaMapMarkerAlt className="text-primary" />
                <span>Mahalakshmi Layout, Bengaluru – 560086</span>
              </div>
              <div className="flex items-center space-x-3 text-text-secondary">
                <FaEnvelope className="text-primary" />
                <a href="mailto:suryachalam18@gmail.com" className="hover:text-primary transition-colors">suryachalam18@gmail.com</a>
              </div>
              <div className="flex items-center space-x-3 text-text-secondary">
                <FaPhone className="text-primary" />
                <span>+91 98445 88551</span>
              </div>
            </div>

            <div className="flex space-x-6 mb-8">
              <a href="https://linkedin.com/in/suryachalam" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-transform hover:-translate-y-1">
                <FaLinkedin />
              </a>
              <a href="https://github.com/sgk18" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-transform hover:-translate-y-1">
                <FaGithub />
              </a>
            </div>

            <div className="flex gap-6">
                <div className="glass-card text-center p-4 min-w-[120px]">
                    <h3 className="text-3xl font-bold text-primary">Fresher</h3>
                    <p className="text-sm text-text-secondary">Experience</p>
                </div>
                <div className="glass-card text-center p-4 min-w-[120px]">
                    <h3 className="text-3xl font-bold text-primary">5+</h3>
                    <p className="text-sm text-text-secondary">Projects</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
