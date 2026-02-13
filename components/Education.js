import { FaGraduationCap } from 'react-icons/fa';

export default function Education() {
  return (
    <section id="education" className="section bg-surface">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Education</h2>
        
        <div className="w-full">
            <div className="glass-card flex items-start space-x-6 hover:border-primary transition-colors duration-300">
                <div className="text-4xl text-primary mt-1">
                    <FaGraduationCap />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">B.Sc. Mathematics & Computer Science</h3>
                    <h4 className="text-xl text-text-secondary mb-1">Christ University, Bangalore</h4>
                    <p className="text-primary font-medium">2025 – 2029</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
