export default function Experience() {
  const experiences = [
    {
      role: 'Web Developer & Organising Committee Member',
      company: 'Centre for Peace Praxis, CHRIST University',
      duration: 'Jul 2025 – Present',
      responsibilities: [
        'Developed and maintained official website.',
        'Improved usability and responsiveness.',
        'Used Git & GitHub for collaboration.',
      ],
    },
  ];

  return (
    <section id="experience" className="section bg-background">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Experience</h2>
        
        <div className="relative border-l-4 border-primary ml-2 md:ml-4 space-y-12">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 md:pl-12">
              <div className="absolute -left-3.5 top-1.5 w-6 h-6 bg-background border-4 border-primary rounded-full"></div>
              <div className="glass-card">
                <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
                <h4 className="text-xl text-primary mb-2">{exp.company}</h4>
                <p className="text-text-secondary text-sm mb-4 italic">{exp.duration}</p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
