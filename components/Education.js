import { FaGraduationCap } from 'react-icons/fa';

export default function Education() {
  return (
    <section id="education" className="section bg-surface">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Education</h2>
        
        <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 hover:border-primary/50 transition-all duration-300 group">
                <div className="p-4 bg-primary/10 rounded-full text-4xl text-primary group-hover:scale-110 transition-transform duration-300">
                    <FaGraduationCap />
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                        <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">B.Sc. Mathematics & Computer Science</h3>
                        <span className="text-sm font-semibold px-3 py-1 bg-white/5 border border-white/10 rounded-full mt-2 md:mt-0 text-text-secondary">
                            2025 – 2029
                        </span>
                    </div>
                    <h4 className="text-xl text-text-secondary font-medium">Christ University, Bangalore</h4>
                    <p className="mt-4 text-text-secondary leading-relaxed">
                        Focusing on core computer science concepts, mathematics, and software development principles.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
