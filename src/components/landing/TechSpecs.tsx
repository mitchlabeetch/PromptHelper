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
                Deterministically maps user intent to specific prompting strategies (e.g., &quot;If Coding → Use Chain of Thought&quot;, &quot;If Creative → High Temperature&quot;).
             </p>
          </div>

          <div className="space-y-4">
             <div className="mx-auto h-12 w-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 text-zinc-400">
                <Cpu className="h-6 w-6" />
             </div>
             <h3 className="text-white font-bold">The Brain</h3>
             <p className="text-zinc-400 text-sm leading-relaxed">
                Powered by <strong>Meta Llama 3.3 70B</strong> (via Groq) with 30 RPM free tier. Fallback to <strong>Google Gemini 1.5 Flash</strong> for reliability. Rate-limited for fair use.
             </p>
          </div>

       </div>
    </div>
  );
}