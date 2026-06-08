"use client";

import ScrollReveal from "./ScrollReveal";

const principles = [
  {
    number: "01",
    title: "Build for the next engineer",
    body: "Code is read far more than it is written. Every abstraction, variable name, and system boundary should communicate intent — not just to machines, but to the person on-call at 2am.",
  },
  {
    number: "02",
    title: "Measure before you optimize",
    body: "Premature optimization is where good systems go to die. Instrument first, identify the actual bottleneck, then fix it. A cache that solves the wrong problem is technical debt disguised as performance.",
  },
  {
    number: "03",
    title: "Prefer simple, push complexity to the edges",
    body: "A boring architecture that solves the problem beats an elegant one that introduces six new failure modes. Complexity is unavoidable — it should live at the boundaries where it's most visible and testable.",
  },
  {
    number: "04",
    title: "Security is architecture, not a checklist",
    body: "Authorization enforced only at the API layer is one bug away from a breach. Defense-in-depth means row-level security at the database, scoped tokens at the API, and input validation at every boundary.",
  },
  {
    number: "05",
    title: "Ship working software, then make it good",
    body: "A perfect system that never ships helps no one. The goal is to deliver value incrementally, with enough architecture to avoid rewriting everything in six months. Good enough and shipped beats perfect and planned.",
  },
  {
    number: "06",
    title: "Understand the why before the how",
    body: "Every technology choice carries tradeoffs. Picking a tool without understanding what problems it solves means you inherit its complexity without leveraging its strengths. Read the docs, not just the tutorials.",
  },
];

export default function Philosophy() {
  return (
    <section id="philosophy" className="section-padding bg-white border-b-2 border-[#0A0A0A]">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="w-4 h-4 bg-[#E3000F] border-2 border-[#0A0A0A] inline-block" />
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-[#0A0A0A]">PHILOSOPHY</h2>
          </div>
          
          <p className="text-[#3a3a3a] font-medium mt-[-20px] mb-12 max-w-2xl leading-relaxed">
            These are the principles that guide every technical decision I make — from database schema design to how I name a function.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => (
              <div
                key={p.number}
                className="group border-2 border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#0A0A0A] rounded-none transition-all duration-150 flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-3xl font-black text-[#E3000F] select-none shrink-0">
                    {p.number}
                  </span>
                  <h3 className="text-[#0A0A0A] font-black uppercase text-base leading-snug pt-1.5">
                    {p.title}
                  </h3>
                </div>
                <p className="text-[#3a3a3a] font-medium text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

