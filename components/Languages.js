export default function Languages() {
  return (
    <section id="languages" className="section bg-surface">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Languages</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
            <div className="glass-card p-6">
                <h3 className="text-2xl font-bold text-primary mb-6 border-b border-gray-700 pb-2">Professional</h3>
                <div className="flex flex-wrap gap-3">
                    {['English', 'Kannada', 'Tamil', 'Hindi'].map((lang) => (
                        <span key={lang} className="px-4 py-2 bg-background rounded-full text-white border border-gray-700 hover:border-primary transition-colors">
                            {lang}
                        </span>
                    ))}
                </div>
            </div>

            <div className="glass-card p-6">
                <h3 className="text-2xl font-bold text-accent mb-6 border-b border-gray-700 pb-2">Elementary</h3>
                <div className="flex flex-wrap gap-3">
                    {['French', 'Japanese'].map((lang) => (
                        <span key={lang} className="px-4 py-2 bg-background rounded-full text-white border border-gray-700 hover:border-accent transition-colors">
                            {lang}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
