import { MessageSquare, Target, Rocket, ArrowRight } from "lucide-react";

export function ProcessTimeline() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Negotiation Protocol",
      subtitle: "Phase 1",
      desc: "The Conductor Agent intercepts your request. It loops through a constraint-extraction algorithm to identify your implicit needs (Budget, Code-Level, Modality) before a single tool is chosen.",
      color: "from-blue-400 to-indigo-400"
    },
    {
      icon: Target,
      title: "Sniper Scope Selection",
      subtitle: "Phase 2",
      desc: "Our logic engine queries a proprietary JSON database of 68 SOTA models. It calculates a 'Fit Score' based on Reasoning, Context Window, and Vision capabilities to deterministically select the single best engine.",
      color: "from-violet-400 to-fuchsia-400"
    },
    {
      icon: Rocket,
      title: "Launch Pad Architecture",
      subtitle: "Phase 3",
      desc: "The Architect Agent generates a JSON-structured Blueprint. It traverses a 'Best Practices' tree to engineer specific, optimized prompts that you simply copy-paste to launch your mission.",
      color: "from-emerald-400 to-teal-400"
    }
  ];

  return (
    <section className="py-24 relative" id="how-it-works">
      
      {/* SECTION HEADER */}
      <div className="text-center mb-20 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">From Chaos to <span className="text-gradient-primary">Concrete.</span></h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">The architecture process is designed to eliminate "Analysis Paralysis" in three steps.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="group relative">
               
               {/* CONNECTING ARROW (Desktop only) */}
               {i < steps.length - 1 && (
                 <div className="hidden md:flex absolute top-1/2 -right-10 w-12 items-center justify-center -translate-y-1/2 z-20 pointer-events-none">
                    <div className="w-full h-[2px] bg-gradient-to-r from-zinc-700 to-zinc-700/50 relative">
                       <ArrowRight className="h-5 w-5 text-zinc-600 absolute -right-1 -top-2.5" />
                    </div>
                 </div>
               )}

               <div className="glass-panel p-8 rounded-3xl h-full relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:border-white/20">
                  {/* ICON */}
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="h-7 w-7 text-black" />
                  </div>
                  
                  <div className="mb-2 text-xs font-mono uppercase tracking-widest text-zinc-500">{step.subtitle}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{step.desc}</p>
               </div>
               
               {/* HOVER GLOW */}
               <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 -z-10`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}