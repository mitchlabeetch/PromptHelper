import { useWizardStore } from "@/store/wizard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, Rocket, Terminal, Layers, Edit2, Loader2, FileText, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { generateMarkdown, generatePDF } from "@/lib/utils/export";
import { generateShareLink } from "@/lib/utils/share";

export function PlanDisplay() {
  const { finalPlan, reset, setFinalPlan } = useWizardStore();
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  
  // Revision State
  const [isRevising, setIsRevising] = useState(false);
  const [revisionInput, setRevisionInput] = useState("");
  const [isRevisingLoading, setIsRevisingLoading] = useState(false);

  if (!finalPlan) return null;

  const copyToClipboard = (text: string, stepNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNum);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleExportMarkdown = () => {
    const md = generateMarkdown(finalPlan, "Launch Plan");
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${finalPlan.plan_title.replace(/\s+/g, '_')}_Plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    generatePDF(finalPlan, "Launch Plan");
  };

  const handleShare = () => {
    const url = generateShareLink(finalPlan);
    navigator.clipboard.writeText(url);
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2000);
  };

  const handleRevise = async () => {
    if (!revisionInput.trim()) return;
    setIsRevisingLoading(true);
    
    try {
      const res = await fetch('/api/architect/plan/revise', {
        method: 'POST',
        body: JSON.stringify({
          currentPlan: finalPlan,
          userInstruction: revisionInput
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setFinalPlan(data);
      setRevisionInput("");
      setIsRevising(false);
      
    } catch (err) {
      console.error(err);
      alert("Failed to revise plan. Please try again.");
    } finally {
      setIsRevisingLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* MISSION HEADER */}
      <div className="text-center space-y-6 pb-6 border-b border-zinc-800">
        <div className="flex flex-wrap justify-center gap-3 mb-2">
             <Badge variant="outline" className="border-violet-500/50 text-violet-400 bg-violet-500/10 px-3 py-1">
                <Rocket className="h-3 w-3 mr-2" /> 
                {finalPlan.is_complete ? "COMPLETE ROADMAP" : "LAUNCH PAD"}
             </Badge>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {finalPlan.plan_title}
        </h1>
        
        <p className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light">
          {finalPlan.plan_description}
        </p>

        {/* TOOL STACK GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 max-w-4xl mx-auto">
           {finalPlan.tool_stack.map((tool, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-left hover:border-zinc-700 transition-all">
                 <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{tool.tool_name}</span>
                    <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400">{tool.output_type}</Badge>
                 </div>
                 <p className="text-xs text-zinc-500 line-clamp-2 italic">&quot;{tool.use_case}&quot;</p>
              </div>
           ))}
        </div>
      </div>

      {/* REVISION INPUT AREA */}
      {isRevising && (
        <div className="bg-violet-900/10 border border-violet-500/30 p-6 rounded-xl animate-in fade-in slide-in-from-top-2">
           <h3 className="text-violet-300 font-bold mb-2 flex items-center gap-2">
             <Edit2 className="h-4 w-4" /> Adjust Plan
           </h3>
           <Textarea 
             value={revisionInput}
             onChange={(e) => setRevisionInput(e.target.value)}
             placeholder="e.g., 'Make the prompts more formal' or 'Add a step for testing'"
             className="bg-black/40 border-violet-500/20 mb-4"
           />
           <div className="flex gap-3">
             <Button size="sm" onClick={handleRevise} disabled={isRevisingLoading} className="bg-violet-600 hover:bg-violet-500">
               {isRevisingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Changes"}
             </Button>
             <Button size="sm" variant="ghost" onClick={() => setIsRevising(false)}>Cancel</Button>
           </div>
        </div>
      )}

      {/* STEPS LAYOUT */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-zinc-400 text-sm uppercase tracking-widest font-bold">
            <Layers className="h-4 w-4" /> Execution Steps
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="step-1">
          {finalPlan.steps.map((step) => (
            <AccordionItem 
              key={step.step_number} 
              value={`step-${step.step_number}`}
              className="border border-zinc-800 bg-zinc-900/30 rounded-xl px-4 overflow-hidden data-[state=open]:border-violet-500/30 data-[state=open]:bg-zinc-900/80 transition-all"
            >
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-5 text-left w-full">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center font-mono text-zinc-400 text-lg font-bold shrink-0 border border-zinc-700">
                    {step.step_number}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-zinc-100 text-lg">{step.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-violet-400 font-medium px-2 py-0.5 bg-violet-500/10 rounded">
                            Using {step.tool_used}
                        </span>
                        <span className="text-xs text-zinc-500 hidden sm:inline-block">
                           Click to reveal prompt
                        </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pb-6 pt-2 space-y-5">
                
                {/* INSTRUCTION */}
                <div className="p-4 bg-zinc-950 rounded-lg border-l-2 border-violet-500 text-zinc-300 text-sm leading-relaxed">
                  <strong className="text-violet-400 block mb-1 text-xs uppercase tracking-wider">Objective</strong> 
                  {step.instruction}
                </div>

                {/* PROMPT CODE BLOCK */}
                <div className="relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button 
                      size="sm" 
                      className="h-8 text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                      onClick={() => copyToClipboard(step.prompt, step.step_number)}
                    >
                      {copiedStep === step.step_number ? (
                        <>
                          <CheckCircle2 className="mr-2 h-3 w-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-3 w-3" /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                  <ScrollArea className="h-auto max-h-[400px] w-full rounded-xl border border-zinc-800 bg-black/40 shadow-inner">
                    <pre className="p-6 text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap selection:bg-violet-500/30">
                      {step.prompt}
                    </pre>
                  </ScrollArea>
                </div>

                {/* TROUBLESHOOTING */}
                {step.troubleshooting_tip && (
                  <div className="flex items-start gap-3 text-xs text-zinc-500 px-2">
                    <Terminal className="h-4 w-4 mt-0.5 text-zinc-600" />
                    <span><span className="text-zinc-400 font-semibold">Pro Tip:</span> {step.troubleshooting_tip}</span>
                  </div>
                )}

              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* OTHER INFO */}
      {finalPlan.other_information && (
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Architect&apos;s Notes</h3>
              <p className="text-sm text-zinc-300">{finalPlan.other_information}</p>
          </div>
      )}

      {/* ACTION FOOTER */}
      <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-zinc-800">
        <Button variant="outline" onClick={reset} className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
          Start New Request
        </Button>
        <Button variant="ghost" className="text-zinc-500 hover:text-zinc-300" onClick={() => setIsRevising(!isRevising)}>
           <Edit2 className="h-4 w-4 mr-2" /> Adjust Plan
        </Button>
        <Button variant="ghost" className="text-zinc-500 hover:text-zinc-300" onClick={handleExportMarkdown}>
           <FileText className="h-4 w-4 mr-2" /> Markdown
        </Button>
        <Button variant="ghost" className="text-zinc-500 hover:text-zinc-300" onClick={handleExportPDF}>
           <Download className="h-4 w-4 mr-2" /> PDF
        </Button>
        <Button variant="ghost" className="text-zinc-500 hover:text-zinc-300" onClick={handleShare}>
           {showShareSuccess ? <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" /> : <Share2 className="h-4 w-4 mr-2" />}
           {showShareSuccess ? "Copied Link!" : "Share"}
        </Button>
      </div>

    </div>
  );
}