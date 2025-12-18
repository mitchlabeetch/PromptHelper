import { useWizardStore } from "@/store/wizard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Capability, CapabilityEnum } from "@/types/selection";
import { clsx } from "clsx";
import { Sparkles, DollarSign, Code, FileText, Image, Video, Music, Box, Database } from "lucide-react";

const CAPABILITY_ICONS: Record<Capability, React.ReactNode> = {
  Text: <FileText className="h-4 w-4" />,
  Code: <Code className="h-4 w-4" />,
  Image: <Image className="h-4 w-4" aria-label="Image icon" />,
  Video: <Video className="h-4 w-4" />,
  Audio: <Music className="h-4 w-4" />,
  "3D": <Box className="h-4 w-4" />,
  Data: <Database className="h-4 w-4" />
};

export function WizardInput() {
  const { 
    userRequest, setUserRequest, 
    capabilities, toggleCapability, 
    constraints, toggleConstraint,
    submitSelection 
  } = useWizardStore();

  return (
    <div className="space-y-8 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
      
      {/* 1. THE PROMPT */}
      <div className="space-y-2">
        <Label htmlFor="request" className="text-zinc-300 font-semibold">
          Your Idea
        </Label>
        <Textarea 
          id="request"
          placeholder="e.g., A python script that scrapes stock prices and alerts me via Telegram..."
          className="min-h-[120px] bg-zinc-950 border-zinc-800 focus:border-violet-500 transition-colors text-lg"
          value={userRequest}
          onChange={(e) => setUserRequest(e.target.value)}
        />
        <p className="text-xs text-zinc-500 text-right">
          {userRequest.length}/10 chars minimum
        </p>
      </div>

      {/* 2. CAPABILITIES */}
      <div className="space-y-3">
        <Label className="text-zinc-300 font-semibold">What output do you need?</Label>
        <div className="flex flex-wrap gap-2">
          {Object.values(CapabilityEnum.enum).map((cap) => {
            const isActive = capabilities.includes(cap);
            return (
              <button
                key={cap}
                onClick={() => toggleCapability(cap)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium",
                  isActive 
                    ? "bg-violet-500/20 border-violet-500 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.2)]" 
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                )}
              >
                {CAPABILITY_ICONS[cap]}
                {cap}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CONSTRAINTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Only */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-zinc-200">Free Tier Only</span>
              <span className="text-xs text-zinc-500">Exclude paid APIs</span>
            </div>
          </div>
          <Switch 
            checked={constraints.freeOnly} 
            onCheckedChange={() => toggleConstraint('freeOnly')} 
          />
        </div>

        {/* No Code */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
              <Code className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-zinc-200">No-Code / GUI</span>
              <span className="text-xs text-zinc-500">Prefer visual builders</span>
            </div>
          </div>
          <Switch 
            checked={constraints.noCode} 
            onCheckedChange={() => toggleConstraint('noCode')} 
          />
        </div>
      </div>

      {/* SUBMIT */}
      <Button 
        size="lg" 
        className="w-full bg-zinc-100 text-zinc-950 hover:bg-white font-bold h-12 text-md shadow-lg shadow-white/5"
        onClick={submitSelection}
        disabled={userRequest.length < 10}
      >
        <Sparkles className="mr-2 h-5 w-5" />
        Analyze & Select Tool
      </Button>

    </div>
  );
}