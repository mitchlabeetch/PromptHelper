import { Database, GitBranch, Cpu } from "lucide-react";

export function TechSpecs() {
  return (
    <div className="py-20 border-t border-zinc-800/50">
       <div className="grid md:grid-cols-3 gap-8 text-center">
          
          <div className="space-y-4">
             <div className="mx-auto h-12 w-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 text-zinc-400">
                <Database className="h-6 w-6" />
             </div>
             <h3 className="text-white font-bold">The Database</h3>
             <p className="text-zinc-400 text-sm leading-relaxed">
                Static JSON-based knowledge base of 68 AI models. Indexed by capabilities (Context Window, Vision, Reasoning) and pricing constraints.
             </p>
          </div>

          <div className="space-y-4">
             <div className="mx-auto h-12 w-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 text-zinc-400">
                <GitBranch className="h-6 w-6" />
             </div>
             <h3 className="text-white font-bold">Logic Tree</h3>
             <p className="text-zinc-400 text-sm leading-relaxed">
                Deterministically maps user intent to specific prompting strategies (e.g., "If Coding &rarr; Use Chain of Thought", "If Creative &rarr; High Temperature").
             </p>
          </div>

          <div className="space-y-4">
             <div className="mx-auto h-12 w-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 text-zinc-400">
                <Cpu className="h-6 w-6" />
             </div>
             <h3 className="text-white font-bold">The Brain</h3>
             <p className="text-zinc-400 text-sm leading-relaxed">
                Powered by <strong>Google Gemini 1.5 Flash</strong> for reasoning and <strong>Meta Llama 3.3 70B</strong> (via Groq) for speed. Zero latency. Zero cost.
             </p>
          </div>

       </div>
    </div>
  );
}