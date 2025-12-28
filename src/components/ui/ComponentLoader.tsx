import { Loader2 } from "lucide-react";

export function ComponentLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full animate-in fade-in duration-500">
      <Loader2 className="h-8 w-8 text-violet-500 animate-spin mb-4" />
      <p className="text-zinc-500 text-sm font-mono">{text}</p>
    </div>
  );
}
