export default function Languages() {
  return (
    <section id="languages" className="section bg-surface">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Languages</h2>
        
        <div className="space-y-12">
            {[
                { title: 'Full Professional', languages: ['English', 'Hindi'] },
                { title: 'Native / Bilingual', languages: ['Kannada', 'Tamil'] },
                { title: 'Elementary', languages: ['French', 'Japanese'] }
            ].map((category, idx) => (
                <div key={idx} className="relative">
                    <h3 className="text-2xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">{category.title}</h3>
                    <div className="flex overflow-x-auto space-x-6 pb-4 no-scrollbar items-stretch">
                        {category.languages.map((lang) => (
                            <div key={lang} className="glass-card flex-shrink-0 px-6 py-4 border border-white/5 bg-surface/40 backdrop-blur-md min-w-[150px] hover:border-primary/50 transition-all duration-300 select-none cursor-pointer text-center">
                                <span className="text-lg font-medium text-white">{lang}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
