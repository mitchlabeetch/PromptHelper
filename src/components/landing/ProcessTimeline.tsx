import { MessageSquare, Target, Rocket, ArrowRight } from "lucide-react";

export function ProcessTimeline() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Negotiation Protocol",
      subtitle: "Phase 1",
      desc: "Our AI listens to your idea and asks smart questions to understand your needs—budget, skill level, and what you want to create.",
      color: "from-blue-400 to-indigo-400"
    },
    {
      icon: Target,
      title: "Sniper Scope Selection",
      subtitle: "Phase 2",
      desc: "We search our curated catalog of 68 top AI tools and calculate a 'Fit Score' based on reasoning power, speed, and your specific requirements to find the single best match.",
      color: "from-violet-400 to-fuchsia-400"
    },
    {
      icon: Rocket,
      title: "Launch Pad Architecture",
      subtitle: "Phase 3",
      desc: "We generate a structured blueprint with optimized, copy-paste prompts designed for your chosen tool. Just follow the steps and launch your project.",
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