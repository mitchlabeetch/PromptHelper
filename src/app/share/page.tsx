"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { LaunchPlan } from "@/types";
import { PlanDisplay } from "@/components/wizard/PlanDisplay";
import { useWizardStore } from "@/store/wizard";
import { Loader2 } from "lucide-react";

function SharePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setFinalPlan, setStep } = useWizardStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');

    // Defer state updates to avoid synchronous set-state-in-effect warning
    const timer = setTimeout(() => {
        if (!data) {
          setError("Invalid share link.");
          return;
        }

        try {
          const decoded = atob(data);
          const plan: LaunchPlan = JSON.parse(decoded);

          setFinalPlan(plan);
          setStep('RESULT');
        } catch (e) {
          console.error("Failed to decode plan:", e);
          setError("This share link appears to be corrupted.");
        }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams, setFinalPlan, setStep]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        <div className="text-center space-y-4">
           <h1 className="text-2xl font-bold">Oops!</h1>
           <p>{error}</p>
           <button onClick={() => router.push('/')} className="underline text-white">Go Home</button>
        </div>
      </div>
    );
  }

  // Reuse the main PlanDisplay component
  return (
    <div className="min-h-screen pt-24 max-w-4xl mx-auto px-4">
       <div className="mb-8 text-center">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900/50">
             Shared Blueprint
          </span>
       </div>
       <PlanDisplay />
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
       </div>
    }>
      <SharePageContent />
    </Suspense>
  );
}
