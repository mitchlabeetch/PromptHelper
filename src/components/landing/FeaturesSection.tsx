import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Brain, Shield, ArrowUpRight } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      
      {/* BACKGROUND BLOBS */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-600/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Engineered for <span className="italic text-zinc-500">Builders.</span></h2>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* LEFT: BENTO GRID FEATURES */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <Zap className="h-6 w-6 text-yellow-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Atomic Prompting</h3>
              <p className="text-sm text-zinc-400">One Step = One Prompt. We generate exact copy-paste code for each phase.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <Brain className="h-6 w-6 text-pink-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Smart Stacking</h3>
              <p className="text-sm text-zinc-400">Complex projects need teams. We chain tools (e.g., Claude + Midjourney) together.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <Shield className="h-6 w-6 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Zero Hallucination</h3>
              <p className="text-sm text-zinc-400">We query a curated, static JSON database of verified models only.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <CheckCircle2 className="h-6 w-6 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Constraint Aware</h3>
              <p className="text-sm text-zinc-400">Strictly respects &quot;Free Only&quot;, &quot;No Code&quot;, or &quot;Open Source&quot; filters.</p>
            </div>
          </div>

          {/* RIGHT: PERSONAS */}
          <div className="space-y-6">
             <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-emerald-500 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <ArrowUpRight className="h-24 w-24 text-emerald-500" />
               </div>
               <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 mb-4 border-none">The Explorer</Badge>
               <h3 className="text-2xl font-bold text-white mb-2">&quot;I want to start using AI.&quot;</h3>
               <p className="text-zinc-400 mb-4">You have an idea but don&apos;t know the tools. We guide you.</p>
               <ul className="space-y-2 text-sm text-zinc-500">
                 <li className="flex gap-2 items-center"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Avoid subscription fatigue.</li>
                 <li className="flex gap-2 items-center"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Learn prompting by doing.</li>
               </ul>
             </div>

             <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-violet-500 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <ArrowUpRight className="h-24 w-24 text-violet-500" />
               </div>
               <Badge className="bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 mb-4 border-none">The Architect</Badge>
               <h3 className="text-2xl font-bold text-white mb-2">&quot;I need to optimize my workflow.&quot;</h3>
               <p className="text-zinc-400 mb-4">You know AI. You just need the specs and the boilerplate.</p>
               <ul className="space-y-2 text-sm text-zinc-500">
                 <li className="flex gap-2 items-center"><div className="h-1.5 w-1.5 rounded-full bg-violet-500" /> Instant SOTA model comparison.</li>
                 <li className="flex gap-2 items-center"><div className="h-1.5 w-1.5 rounded-full bg-violet-500" /> Generate multi-agent strategies.</li>
               </ul>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}