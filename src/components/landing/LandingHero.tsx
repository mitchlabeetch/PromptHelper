import { ArrowRight, Sparkles, PlayCircle, Target, Rocket, Terminal, Settings2, Compass, ChevronDown } from "lucide-react";

interface LandingHeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center px-6 pt-20 pb-16 overflow-hidden">
      
      {/* AMBIENT GLOW BEHIND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-10">
        
        {/* LEFT COLUMN: MAIN COPY */}
        <div className="text-center lg:text-left space-y-6">
          
          {/* BADGE */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-violet-200 shadow-xl">
              <Sparkles className="h-3 w-3 fill-violet-200" />
              <span>WhiteInputSyndrome v2025.12</span>
            </span>
          </div>

          {/* HEADLINE */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-[1.1]">
            <span className="text-white">Build what you </span>
            <span className="text-gradient-primary">imagine.</span>
            <br />
            <span className="text-white/40 text-3xl sm:text-4xl md:text-5xl">We handle the how.</span>
          </h1>

          {/* SUBHEADLINE */}
          <p className="text-base text-zinc-400 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Stop wrestling with generic chatbots. <strong>Cure your creative block.</strong> We analyze your vague ideas, select the perfect specialized AI model, and engineer a battle-ready launch plan.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            <button 
              onClick={onStart}
              className="group relative px-8 py-3 bg-white text-black font-semibold rounded-2xl overflow-hidden transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-2">
                Start Architecting <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button 
              onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 glass-button text-zinc-300 font-medium rounded-2xl hover:text-white flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-4 w-4" /> How it Works
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: STATS + VALUE PROPS */}
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000 delay-600">
            
            {/* STATS PILLS MOVED HERE */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 opacity-80">
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                   <span>68 Models</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                   <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                   <div className="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.8)]" />
                   <span>Verified</span>
                </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl flex gap-4 items-start hover:bg-white/5 transition-colors group cursor-default border-l-4 border-l-emerald-500">
               <div className="mt-1 h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Terminal className="h-4 w-4 text-emerald-400" />
               </div>
               <div>
                  <h4 className="font-bold text-white text-base mb-1 group-hover:text-emerald-300 transition-colors">Execution Ready</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Detailed Plan with fine-tuned, tool-specific prompts ready to be submitted immediately.</p>
               </div>
            </div>
            
            <div className="glass-panel p-5 rounded-2xl flex gap-4 items-start hover:bg-white/5 transition-colors group cursor-default border-l-4 border-l-blue-500">
               <div className="mt-1 h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Settings2 className="h-4 w-4 text-blue-400" />
               </div>
               <div>
                  <h4 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">Stack Flexible</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Can be fully adapted to the tools you already own. No forced subscriptions.</p>
               </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl flex gap-4 items-start hover:bg-white/5 transition-colors group cursor-default border-l-4 border-l-violet-500">
               <div className="mt-1 h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20 group-hover:scale-110 transition-transform">
                  <Compass className="h-4 w-4 text-violet-400" />
               </div>
               <div>
                  <h4 className="font-bold text-white text-base mb-1 group-hover:text-violet-300 transition-colors">Guided Definition</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">The Architect interviews you to crystallize your vague requirements into specs.</p>
               </div>
            </div>
        </div>

      </div>

      {/* BOTTOM: DUAL PATHWAY VISUAL */}
      <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
         <div className="grid md:grid-cols-2 gap-4">
            {/* PRECISION TASK */}
            <div className="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition-colors border-t-2 border-t-blue-500/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="font-bold text-white text-sm">Precision Task</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For specific goals. Get the <span className="text-zinc-200">exact tech stack</span> and <span className="text-zinc-200">fine-tuned prompt</span> to execute immediately.
              </p>
            </div>

            {/* MACRO LAUNCH */}
            <div className="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition-colors border-t-2 border-t-fuchsia-500/50">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-4 w-4 text-fuchsia-400" />
                <span className="font-bold text-white text-sm">Macro Launch</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For complex visions. Architect a <span className="text-zinc-200">strategic launchpad</span> that primes tools to guide you.
              </p>
            </div>
         </div>
      </div>

      {/* SCROLL CUE */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-10" onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}>
         <ChevronDown className="h-6 w-6 text-zinc-600 hover:text-white transition-colors" />
      </div>

    </section>
  );
}