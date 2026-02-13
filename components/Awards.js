import { FaTrophy } from 'react-icons/fa';

export default function Awards() {
  const awards = [
    {
      title: '2nd Place – Frontend Frenzy',
      event: 'Xactitude 2026 IT Fest',
      organizer: 'Kristu Jayanti University',
      year: '2026',
    },
    {
      title: 'SEQUENCE 2025 MPL Winner',
      event: 'SEQUENCE 2025',
      organizer: 'Christ University',
      year: '2025',
    },
  ];

  return (
    <section id="awards" className="section bg-background">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Awards & Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {awards.map((award, index) => (
                <div key={index} className="glass-card p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 hover:border-accent/50 transition-all duration-300 group hover:-translate-y-1">
                    <div className="p-3 bg-yellow-500/10 rounded-full text-3xl text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                        <FaTrophy />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">{award.title}</h3>
                        <p className="text-primary font-medium">{award.event}</p>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-text-secondary">
                             {award.organizer && <span>{award.organizer}</span>}
                             {award.organizer && <span>•</span>}
                             <span>{award.year}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
