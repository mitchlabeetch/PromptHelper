import { TextCursorInput, Code, Image as ImageIcon, Video, Database, Music, Box } from "lucide-react";

export function CapabilitiesGrid() {
  const caps = [
    { icon: TextCursorInput, label: "Copywriting", color: "text-zinc-300" },
    { icon: Code, label: "Coding", color: "text-blue-400" },
    { icon: ImageIcon, label: "Image Gen", color: "text-pink-400" },
    { icon: Video, label: "Video", color: "text-orange-400" },
    { icon: Database, label: "Data Analysis", color: "text-emerald-400" },
    { icon: Music, label: "Audio", color: "text-violet-400" },
    { icon: Box, label: "3D Models", color: "text-yellow-400" },
  ];

  return (
    <div className="py-20 border-t border-zinc-800/50" id="how-it-works">
       <div className="text-center mb-12">
         <h2 className="text-2xl font-bold text-white mb-4">Optimized for Every Modality</h2>
         <p className="text-zinc-400 text-sm">We don&apos;t just pick a chatbot. We find the specialized engine for your specific need.</p>
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {caps.map((c) => (
             <div key={c.label} className="flex flex-col items-center justify-center p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl hover:bg-zinc-900 hover:border-zinc-700 transition-colors group cursor-default">
                <c.icon className={`h-6 w-6 mb-3 ${c.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                <span className="text-xs font-medium text-zinc-400 group-hover:text-white">{c.label}</span>
             </div>
          ))}
       </div>
    </div>
  );
}