import { useWizardStore } from "@/store/wizard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trophy, RefreshCw, ExternalLink } from "lucide-react";

export function ToolReveal() {
  const { selectedTool, submitPlan, reset } = useWizardStore();

  if (!selectedTool) return null;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-zinc-100">Your Best Match</h2>
        <Button variant="ghost" size="sm" onClick={reset} className="text-zinc-400 hover:text-zinc-100">
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>

      <Card className="border-zinc-700 bg-zinc-900/80 overflow-hidden relative group">
        {/* GLOW EFFECT */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/50">
                  <Trophy className="h-3 w-3 mr-1" /> BEST MATCH
                </Badge>
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                  {selectedTool.provider}
                </span>
              </div>
              <CardTitle className="text-4xl font-bold text-white">
                {selectedTool.name}
              </CardTitle>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-3xl font-black text-emerald-400">{selectedTool.specs.reasoning_level}<span className="text-sm text-zinc-400 font-medium">/10</span></div>
              <div className="text-xs text-zinc-500 uppercase font-bold">Reasoning</div>
            </div>
          </div>
          <CardDescription className="text-lg text-zinc-400 mt-2">
            {selectedTool.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6">
          {/* SPECS GRID */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
              <span className="block text-zinc-500 text-xs uppercase">Speed</span>
              <span className="font-mono text-emerald-400">{selectedTool.specs.speed_level}/10</span>
            </div>
            <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
              <span className="block text-zinc-500 text-xs uppercase">Coding</span>
              <span className="font-mono text-blue-400">{selectedTool.specs.coding_level}/10</span>
            </div>
            <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
              <span className="block text-zinc-500 text-xs uppercase">Ease</span>
              <span className="font-mono text-violet-400">{selectedTool.specs.ease_of_use}/10</span>
            </div>
            <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
              <span className="block text-zinc-500 text-xs uppercase">Cost</span>
              <span className="font-mono text-zinc-300">{selectedTool.has_free_tier ? "Free Tier" : "Paid"}</span>
            </div>
          </div>

          {/* USE CASE */}
          <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/50 flex flex-col justify-center">
            <span className="text-xs text-zinc-500 uppercase font-bold mb-2">Why this tool?</span>
            <p className="text-sm text-zinc-300 italic">"{selectedTool.ideal_use_case}"</p>
          </div>
        </CardContent>

        <CardFooter className="bg-zinc-950/30 pt-6 border-t border-zinc-800 flex justify-between items-center">
            <a 
              href={selectedTool.website_url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-zinc-500 hover:text-zinc-300 text-sm flex items-center gap-2 transition-colors"
            >
              Visit Website <ExternalLink className="h-3 w-3" />
            </a>
            
            <Button size="lg" onClick={submitPlan} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              Generate Launch Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}