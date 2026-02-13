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
    <section id="contact" className="section bg-background pt-20 pb-12 relative overflow-hidden">
        {/* Decorative BG Elements */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]"></div>
        </div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="section-title mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary animate-gradient-x">
            Initialize Connection
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-16 mb-20">
          {/* Left Column: Contact Info */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
                <h3 className="text-3xl font-bold text-white mb-4 font-mono">
                    <span className="text-primary">&gt;</span> STATUS: <span className="text-green-400">ONLINE</span>
                </h3>
                <p className="text-text-secondary leading-relaxed text-lg border-l-2 border-white/10 pl-4">
                  Currently accepting new side quests and main storyline missions. Deploy a message to the server below.
                </p>
            </div>
            
            <div className="space-y-4 pt-6">
              <a href="mailto:suryachalam18@gmail.com" className="flex items-center space-x-4 text-text-secondary hover:text-white transition-all glass-card p-5 group hover:border-primary/50 hover:bg-primary/5">
                <div className="p-3 bg-white/5 rounded-lg text-primary group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all duration-300">
                    <FaEnvelope className="text-xl" />
                </div>
                <span className="font-mono tracking-wide">suryachalam18@gmail.com</span>
              </a>
              <a href="https://linkedin.com/in/suryachalam" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-text-secondary hover:text-white transition-all glass-card p-5 group hover:border-primary/50 hover:bg-primary/5">
                 <div className="p-3 bg-white/5 rounded-lg text-blue-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300">
                    <FaLinkedin className="text-xl" />
                 </div>
                <span className="font-mono tracking-wide">/in/suryachalam</span>
              </a>
              <a href="https://github.com/sgk18" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-text-secondary hover:text-white transition-all glass-card p-5 group hover:border-primary/50 hover:bg-primary/5">
                <div className="p-3 bg-white/5 rounded-lg text-white group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
                    <FaGithub className="text-xl" />
                </div>
                <span className="font-mono tracking-wide">/sgk18</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8 border border-white/5 bg-surface/30 backdrop-blur-xl relative">
                {/* Decoration Lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label htmlFor="name" className="text-xs font-bold text-primary uppercase tracking-widest ml-1 opacity-70 group-hover:opacity-100 transition-opacity">Player Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-4 text-white focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300 skew-x-[-2deg]"
                    placeholder="Enter Gamertag..."
                  />
                </div>
                <div className="space-y-2 group">
                  <label htmlFor="email" className="text-xs font-bold text-primary uppercase tracking-widest ml-1 opacity-70 group-hover:opacity-100 transition-opacity">Comms Channel</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-4 text-white focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300 skew-x-[-2deg]"
                    placeholder="email@server.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <label htmlFor="message" className="text-xs font-bold text-primary uppercase tracking-widest ml-1 opacity-70 group-hover:opacity-100 transition-opacity">Transmission</label>
                <textarea 
                  id="message" 
                  required 
                  rows="5"
                  className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-4 text-white focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300 resize-none skew-x-[-2deg]"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <button type="submit" className="w-full py-5 text-lg font-bold uppercase tracking-widest bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 ease-out flex items-center justify-center gap-3 group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                    <FaPaperPlane /> SEND TRANSMISSION
                </span>
              </button>

              {status && (
                <p className={`text-center text-sm font-mono ${status.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-8 text-center bg-black/20">
            <p className="text-text-secondary text-xs uppercase tracking-widest font-mono">
                &copy; {new Date().getFullYear()} Suryachalam V M. All Systems Operational.
            </p>
        </div>
      </div>
    </section>
  );
}
