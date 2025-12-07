import { useState, useEffect } from "react";
import { Tool } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, Trophy, ExternalLink } from "lucide-react";
import { useWizardStore } from "@/store/wizard";

interface ToolRevealArtifactProps {
  selectionData: Record<string, unknown>;
}

export function ToolRevealArtifact({ selectionData }: ToolRevealArtifactProps) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [auxTools, setAuxTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { setUserRequest, setSelectedTool, setStep } = useWizardStore();

  useEffect(() => {
    let mounted = true;

    async function fetchTool() {
      try {
        const res = await fetch('/api/architect/select', {
          method: 'POST',
          body: JSON.stringify(selectionData)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
           throw new Error(data.error || "Selection failed");
        }
        
        if (mounted) {
          setTool(data.tool);
          setAuxTools(data.auxiliary_tools || []);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
    }

    fetchTool();
    
    return () => { mounted = false; };
  }, [selectionData]);

  const handleProceed = () => {
    if (!tool) return;
    if (selectionData.userRequest && typeof selectionData.userRequest === 'string') {
      setUserRequest(selectionData.userRequest);
    }
    setSelectedTool(tool);
    setStep("CONFIRMATION");
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md bg-white/5 border-white/10 animate-pulse">
        <CardContent className="p-6 flex items-center justify-center gap-3 text-zinc-500">
           <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
           <span>Analyzing 68 tools...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) return <Card className="bg-red-900/20 border-red-500/30 p-4 text-red-400">{error}</Card>;
  if (!tool) return null;

  return (
    <Card className="w-full max-w-md border border-white/10 bg-zinc-950/80 backdrop-blur-xl overflow-hidden relative group shadow-2xl">
       <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/20 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none" />
       
       <CardHeader className="pb-4 relative z-10">
         <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 text-[10px] tracking-wider font-bold">
               <Trophy className="h-3 w-3 mr-1" /> PRIMARY ARCHITECT
            </Badge>
            <span className="text-[10px] uppercase text-zinc-500 font-mono border border-white/5 px-2 py-0.5 rounded-full bg-black/20">{tool.provider}</span>
         </div>
         <CardTitle className="text-2xl text-white font-bold tracking-tight">{tool.name}</CardTitle>
         <CardDescription className="text-zinc-400 text-xs line-clamp-2 mt-1">
            {tool.description}
         </CardDescription>
       </CardHeader>

       <CardContent className="pb-4 space-y-5 relative z-10">
          {/* MAIN SPECS */}
          <div className="grid grid-cols-2 gap-3 text-xs">
             <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-zinc-500 block mb-1 uppercase tracking-widest text-[10px]">Reasoning</span>
                <span className="text-emerald-400 font-mono text-lg">{tool.specs.reasoning_level}<span className="text-zinc-600 text-xs">/10</span></span>
             </div>
             <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-zinc-500 block mb-1 uppercase tracking-widest text-[10px]">Coding</span>
                <span className="text-blue-400 font-mono text-lg">{tool.specs.coding_level}<span className="text-zinc-600 text-xs">/10</span></span>
             </div>
          </div>

          {/* AUX SQUAD */}
          {auxTools.length > 0 && (
             <div className="pt-4 border-t border-white/5">
                <span className="text-[10px] text-violet-400 uppercase tracking-widest font-bold mb-3 block flex items-center gap-2">
                   <Badge variant="default" className="h-1.5 w-1.5 rounded-full p-0 bg-violet-500" /> Tool Squad
                </span>
                <div className="flex flex-wrap gap-2">
                   {auxTools.map(t => (
                      <Badge key={t.id} variant="secondary" className="bg-white/10 text-zinc-300 hover:bg-white/20 border border-white/5 px-2 py-1">
                         {t.name}
                      </Badge>
                   ))}
                </div>
             </div>
          )}
       </CardContent>

       <CardFooter className="bg-black/40 pt-4 pb-4 flex justify-between items-center border-t border-white/5 relative z-10">
          <a href={tool.website_url} target="_blank" className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
             Visit Website <ExternalLink className="h-3 w-3" />
          </a>
          <Button size="sm" onClick={handleProceed} className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-violet-500/50">
             Generate Plan <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
       </CardFooter>
    </Card>
  );
}
