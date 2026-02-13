export default function Experience() {
  const experiences = [
    {
      role: 'Web Developer & Organising Committee Member',
      company: 'Centre for Peace Praxis, CHRIST University',
      duration: 'Jul 2025 – Present',
      responsibilities: [
        'Developed and maintained the official website using HTML5, CSS3, and responsive design principles.',
        'Improved usability and mobile responsiveness for cross-device compatibility.',
        'Collaborated with core committee members to support academic and peacebuilding events.',
        'Used Git & GitHub for version control and collaborative development.',
      ],
    },
  ];

  return (
    <section id="experience" className="section bg-background">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Experience</h2>
        
        <div className="relative border-l-2 border-primary/30 ml-3 md:ml-6 space-y-12">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 md:pl-12 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-5 h-5 bg-background border-4 border-primary rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{exp.role}</h3>
                    <h4 className="text-lg text-text-secondary font-medium">{exp.company}</h4>
                  </div>
                  <span className="text-sm font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full w-fit mt-2 sm:mt-0 border border-primary/20">
                    {exp.duration}
                  </span>
              </div>

              <div className="glass-card p-6 hover:bg-white/5 transition-colors">
                <ul className="list-disc list-inside space-y-2 text-text-secondary marker:text-primary">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="leading-relaxed">{resp}</li>
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
