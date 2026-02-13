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
    <section id="contact" className="section bg-background">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Get In Touch</h2>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Contact Info */}
          <div className="w-full md:w-1/3 space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
            <p className="text-text-secondary leading-relaxed">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            
            <div className="space-y-4">
              <a href="mailto:your-email@example.com" className="flex items-center space-x-3 text-text-secondary hover:text-primary transition-colors glass-card p-4">
                <FaEnvelope className="text-xl" />
                <span>Send an email</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-text-secondary hover:text-primary transition-colors glass-card p-4">
                <FaLinkedin className="text-xl" />
                <span>LinkedIn</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-text-secondary hover:text-primary transition-colors glass-card p-4">
                <FaGithub className="text-xl" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="glass-card space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-text-secondary">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-text-secondary">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-text-secondary">Message</label>
                <textarea 
                  id="message" 
                  required 
                  rows="5"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button type="submit" className="w-full btn btn-primary flex items-center justify-center space-x-2">
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
      </div>
    </section>
  );
}
