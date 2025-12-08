// src/app/page.tsx
"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizard";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ToolReveal } from "@/components/wizard/ToolReveal";
import { PlanDisplay } from "@/components/wizard/PlanDisplay";
import { LandingHero } from "@/components/landing/LandingHero";
import { CapabilitiesGrid } from "@/components/landing/CapabilitiesGrid";
import { ProcessTimeline } from "@/components/landing/ProcessTimeline";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PlanPreview } from "@/components/landing/PlanPreview";
import { TechSpecs } from "@/components/landing/TechSpecs";
import { Loader2, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const { step, isLoading, error, setStep } = useWizardStore();
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setHasStarted(false);
  };

  return (
    <main className="min-h-screen selection:bg-violet-500/30">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 border-b border-white/5 p-4 bg-black/50 backdrop-blur-xl z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleBackToLanding}>
            <div className="relative h-8 w-8 group-hover:scale-110 transition-transform duration-300">
               <Image src="/logo.svg" alt="WhiteInputSyndrome Logo" fill className="object-contain" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white font-mono">WHITE<span className="text-violet-400">INPUT</span>SYNDROME</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {hasStarted && step === 'INPUT' && (
              <Button variant="ghost" size="sm" onClick={handleBackToLanding} className="text-zinc-500 hover:text-white">
                 <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            )}
            {!hasStarted && (
               <Button size="sm" onClick={handleStart} className="bg-white text-black hover:bg-zinc-200 font-semibold hidden sm:flex rounded-full px-6">
                  Start Now
               </Button>
            )}
          </div>
        </div>
      </header>

      {/* LANDING PAGE STATE */}
      {!hasStarted && (
        <div className="pt-16"> {/* Offset for fixed header */}
          <LandingHero onStart={handleStart} />
          
          <div id="timeline" className="scroll-mt-20">
             <ProcessTimeline />
          </div>
          
          <div id="features" className="scroll-mt-20">
             <FeaturesSection />
          </div>
          
          <CapabilitiesGrid />
          
          <div id="preview" className="scroll-mt-20">
             <PlanPreview />
          </div>
          
          <TechSpecs />
          
          {/* FINAL CTA */}
          <div className="py-24 text-center space-y-8 bg-gradient-to-b from-transparent to-violet-900/20">
             <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Ready to Launch?</h2>
             <p className="text-zinc-400 text-lg">Stop prompting in the dark. Turn your idea into a plan.</p>
             <Button size="lg" onClick={handleStart} className="h-16 px-10 text-xl font-bold bg-white text-black hover:bg-zinc-200 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1">
                <Zap className="mr-2 h-6 w-6 fill-black" /> Start Architecting
             </Button>
          </div>

          <footer className="py-8 border-t border-white/5 text-center text-zinc-600 text-sm bg-black/40">
             <p>Powered by OpenRouter • DeepSeek R1 & Llama 3.3 • Open Source</p>
          </footer>
        </div>
      )}

      {/* APP FLOW STATE */}
      {hasStarted && (
        <div className="max-w-4xl mx-auto px-4 py-24 h-full min-h-screen flex flex-col">
          
          {/* GLOBAL ERROR STATE */}
          {error && (
            <div className="mb-8 p-4 bg-red-950/30 border border-red-800/50 rounded-lg text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
              🚨 Error: {error}
            </div>
          )}

          {/* STEP 1: INPUT (Chat Interface) */}
          {step === "INPUT" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
              <div className="mb-8 text-center sm:text-left">
                 <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Describe your vision.</h2>
                 <p className="text-zinc-400 text-sm">
                   I'll help you refine your idea, then negotiate the perfect tool stack for you.
                 </p>
              </div>
              <div className="flex-1">
                 <ChatInterface />
              </div>
            </div>
          )}

          {/* LOADING STATE (Selecting) */}
          {step === "SELECTING" && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500 flex-1">
              <div className="relative">
                 <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                 <Loader2 className="h-16 w-16 text-violet-500 animate-spin relative z-10" />
              </div>
              <h3 className="text-2xl font-bold mt-8 text-white">Running Sniper Scope...</h3>
              <p className="text-zinc-500 mt-2 font-mono text-sm">Filtering 68 tools • Calculating capability scores</p>
            </div>
          )}

          {/* STEP 2: CONFIRMATION (Tool Reveal) */}
          {step === "CONFIRMATION" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ToolReveal />
            </div>
          )}

          {/* LOADING STATE (Planning) */}
          {step === "PLANNING" && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500 flex-1">
              <div className="relative">
                 <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                 <Loader2 className="h-16 w-16 text-emerald-500 animate-spin relative z-10" />
              </div>
              <h3 className="text-2xl font-bold mt-8 text-white">Architecting Prompt Plan...</h3>
              <p className="text-zinc-500 mt-2 font-mono text-sm">Traversing logic tree • Optimizing constraints</p>
            </div>
          )}

          {/* STEP 3: RESULT (Plan Display) */}
          {step === "RESULT" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PlanDisplay />
            </div>
          )}

        </div>
      )}
    </main>
  );
}