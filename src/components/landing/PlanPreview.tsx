import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Copy, Maximize2, Minimize2, Terminal } from "lucide-react";

export function PlanPreview() {
  return (
    <section className="py-24 px-4 relative">
       
       <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-zinc-500 border-zinc-800">The Artifact</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">A Battle-Ready <span className="text-gradient-primary">Blueprint.</span></h2>
          <p className="text-zinc-400 text-lg">No vague advice. You get a JSON-structured, actionable roadmap.</p>
       </div>

       {/* HUD CONTAINER */}
       <div className="max-w-5xl mx-auto relative perspective-1000">
          
          {/* GLOW UNDERNEATH */}
          <div className="absolute -inset-4 bg-violet-600/20 blur-3xl rounded-[30px] -z-10" />

          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl transform rotate-x-2 transition-transform duration-700 hover:rotate-x-0">
             
             {/* HUD HEADER */}
             <div className="bg-black/40 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                   </div>
                   <div className="h-4 w-[1px] bg-white/10" />
                   <span className="text-xs font-mono text-emerald-400">PLAN_ID: #8X29-ALPHA</span>
                </div>
                <div className="flex gap-4 text-xs text-zinc-600 font-mono uppercase">
                   <span>Status: Ready</span>
                   <span>Latency: 12ms</span>
                </div>
             </div>

             {/* MAIN CONTENT AREA */}
             <div className="grid md:grid-cols-[300px_1fr] min-h-[500px]">
                
                {/* SIDEBAR */}
                <div className="border-r border-white/5 p-6 bg-black/20 hidden md:block">
                   <div className="mb-8">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">Tool Stack</div>
                      <div className="space-y-3">
                         <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-violet-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                               <span className="text-sm font-bold text-white">Claude 3.5</span>
                               <Badge className="text-[10px] h-4 bg-blue-500/20 text-blue-400 border-none">CODE</Badge>
                            </div>
                            <div className="text-[10px] text-zinc-500">Logic & Backend</div>
                         </div>
                         <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-pink-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                               <span className="text-sm font-bold text-white">Midjourney v6</span>
                               <Badge className="text-[10px] h-4 bg-pink-500/20 text-pink-400 border-none">ART</Badge>
                            </div>
                            <div className="text-[10px] text-zinc-500">Asset Generation</div>
                         </div>
                      </div>
                   </div>

                   <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">Telemetry</div>
                      <div className="space-y-2 font-mono text-xs text-zinc-600">
                         <div className="flex justify-between"><span>Est. Time</span> <span className="text-zinc-400">2h 30m</span></div>
                         <div className="flex justify-between"><span>Steps</span> <span className="text-zinc-400">4 Phases</span></div>
                         <div className="flex justify-between"><span>Cost</span> <span className="text-emerald-400">$0.00</span></div>
                      </div>
                   </div>
                </div>

                {/* MAIN VIEW */}
                <div className="p-8 relative">
                    {/* WATERMARK */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                       <Rocket className="h-64 w-64" />
                    </div>

                    <div className="relative z-10">
                       <div className="mb-8">
                          <h3 className="text-2xl font-bold text-white mb-2">Retro 8-Bit Game Generator</h3>
                          <p className="text-zinc-400 text-sm">"Mission: Create a playable Snake clone using Python and Pygame assets."</p>
                       </div>

                       <div className="space-y-6">
                          {/* STEP CARD 1 */}
                          <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors group">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">01</div>
                                <div>
                                   <div className="text-white font-medium">Core Game Loop</div>
                                   <div className="text-xs text-zinc-500">Using Claude 3.5 Sonnet</div>
                                </div>
                             </div>
                             
                             {/* CODE BLOCK */}
                             <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-zinc-300 relative border border-white/5">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-500 hover:text-white">
                                      <Copy className="h-3 w-3" />
                                   </Button>
                                </div>
                                <span className="text-violet-400">Act as</span> a Senior Python Developer.<br/>
                                <span className="text-violet-400">Create</span> a robust main.py using Pygame.<br/>
                                <br/>
                                Requirements:<br/>
                                - 60 FPS Game Loop<br/>
                                - Vector-based movement<br/>
                                ...
                             </div>
                          </div>

                          {/* STEP CARD 2 */}
                          <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors group">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">02</div>
                                <div>
                                   <div className="text-white font-medium">Asset Generation</div>
                                   <div className="text-xs text-zinc-500">Using Midjourney v6</div>
                                </div>
                             </div>
                             
                             {/* CODE BLOCK */}
                             <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-zinc-300 relative border border-white/5">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-500 hover:text-white">
                                      <Copy className="h-3 w-3" />
                                   </Button>
                                </div>
                                <span className="text-pink-400">/imagine</span> prompt: 16-bit pixel art sprite sheet<br/>
                                <span className="text-zinc-500">--style</span> retro arcade<br/>
                                <span className="text-zinc-500">--ar</span> 16:9<br/>
                                <br/>
                                Subjects: Green Snake, Red Apple, Stone Wall block...
                             </div>
                          </div>
                       </div>
                    </div>
                </div>

             </div>

          </div>
       </div>
    </section>
  );
}