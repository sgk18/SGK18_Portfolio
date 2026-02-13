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
                <div key={index} className="glass-card flex items-start space-x-4 hover:border-accent transition-colors duration-300">
                    <div className="text-3xl text-yellow-500 mt-1">
                        <FaTrophy />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{award.title}</h3>
                        <p className="text-primary">{award.event}</p>
                        {award.organizer && <p className="text-text-secondary text-sm">{award.organizer}</p>}
                    </div>
                    <div className="ml-auto text-4xl font-bold text-gray-800 opacity-20 transform -rotate-12">
                        {award.year}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
