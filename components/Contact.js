import { useState } from 'react';
import { FaPaperPlane, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    // Simulate form submission
    setTimeout(() => {
      setStatus('Message sent successfully!');
      e.target.reset();
    }, 1500);
  };

  return (
    <section id="contact" className="section bg-background pt-20 pb-10">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Get In Touch</h2>
        
        <div className="flex flex-col lg:flex-row gap-16 mb-20">
          {/* Contact Info */}
          <div className="w-full lg:w-1/3 space-y-8">
            <h3 className="text-3xl font-bold text-white mb-6">Let's Connect</h3>
            <p className="text-text-secondary leading-relaxed text-lg">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            
            <div className="space-y-4">
              <a href="mailto:suryachalam18@gmail.com" className="flex items-center space-x-4 text-text-secondary hover:text-white transition-all glass-card p-5 group hover:border-primary/50">
                <div className="p-3 bg-white/5 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <FaEnvelope className="text-xl" />
                </div>
                <span className="font-medium">suryachalam18@gmail.com</span>
              </a>
              <a href="https://linkedin.com/in/suryachalam" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-text-secondary hover:text-white transition-all glass-card p-5 group hover:border-primary/50">
                 <div className="p-3 bg-white/5 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
                    <FaLinkedin className="text-xl" />
                 </div>
                <span className="font-medium">LinkedIn</span>
              </a>
              <a href="https://github.com/sgk18" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-text-secondary hover:text-white transition-all glass-card p-5 group hover:border-primary/50">
                <div className="p-3 bg-white/5 rounded-full text-white group-hover:scale-110 transition-transform">
                    <FaGithub className="text-xl" />
                </div>
                <span className="font-medium">GitHub</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-text-secondary block">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all focus:bg-background"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-text-secondary block">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all focus:bg-background"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-text-secondary block">Message</label>
                <textarea 
                  id="message" 
                  required 
                  rows="5"
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all focus:bg-background resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button type="submit" className="w-full btn btn-primary flex items-center justify-center space-x-2 py-4 text-lg">
                <FaPaperPlane />
                <span>Send Message</span>
              </button>

              {status && (
                <p className={`text-center text-sm ${status.includes('success') ? 'text-green-500' : 'text-text-secondary'}`}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-text-secondary text-sm">
                &copy; {new Date().getFullYear()} Suryachalam V M. All rights reserved.
            </p>
        </div>
      </div>
    </section>
  );
}
