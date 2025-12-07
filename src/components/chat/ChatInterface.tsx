import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Loader2, RefreshCw, Terminal } from "lucide-react";
import { clsx } from "clsx";
import { ToolRevealArtifact } from "./ToolRevealArtifact";

interface InterpretationOption {
  id: string;
  label: string;
  description: string;
}

export function ChatInterface() {
  const { messages, sendMessage, isLoading, resetChat } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    if (trimmedInput.length < 3) {
      alert("Please provide more details about your project (at least 3 characters).");
      return;
    }
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Escape") {
      setInput("");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col min-h-[60vh] sm:min-h-[50vh] max-h-[85vh] h-auto w-full max-w-4xl mx-auto glass-panel rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-4">
      
      {/* CHAT HEADER */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-widest">
          <Terminal className="h-4 w-4" />
          <span>Architect Session</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetChat} 
          className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-lg transition-colors"
          title="Reset Session"
          aria-label="Reset chat session"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 scroll-smooth custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3 sm:gap-4 max-w-[95%] sm:max-w-[90%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto animate-in fade-in slide-in-from-left-2 duration-300"
            )}
          >
            {/* AVATAR */}
            <div className={clsx(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
              msg.role === "assistant" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50"
            )}>
              {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>

            {/* CONTENT */}
            <div className="space-y-2 max-w-full">
              <div className={clsx(
                "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                msg.role === "user" 
                  ? "bg-violet-600/10 border border-violet-500/20 text-violet-100 rounded-tr-none backdrop-blur-sm" 
                  : "bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none backdrop-blur-sm"
              )}>
                {msg.content}
              </div>

              {/* ARTIFACT RENDERER */}
              {msg.artifact && msg.artifact.type === "TOOL_SELECTION" && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ToolRevealArtifact selectionData={msg.artifact.data} />
                </div>
              )}

              {/* INTERPRETATION OPTIONS RENDERER */}
              {msg.artifact && msg.artifact.type === "INTERPRETATION_OPTIONS" && Array.isArray(msg.artifact.data) && (
                <div className="mt-4 grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {(msg.artifact.data as unknown as InterpretationOption[]).map((option) => (
                      <button
                        key={option.id}
                        onClick={() => sendMessage(`I choose option ${option.id}: ${option.label}. ${option.description}`)}
                        className="text-left p-4 glass-button rounded-xl group transition-all hover:border-violet-500/30"
                      >
                        <div className="font-medium text-violet-300 group-hover:text-violet-200 mb-1 flex items-center gap-2">
                           <span className="bg-violet-500/10 w-6 h-6 flex items-center justify-center rounded-full text-xs border border-violet-500/20 font-mono">{option.id}</span>
                           {option.label}
                        </div>
                        <div className="text-zinc-400 text-xs ml-8 group-hover:text-zinc-300">{option.description}</div>
                      </button>
                   ))}
                   <button 
                      onClick={() => sendMessage("None of these really fit what I have in mind. I'll explain more.")}
                      className="text-center p-3 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-lg transition-colors"
                   >
                      None of these fit perfectly
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 max-w-[90%] mr-auto animate-in fade-in slide-in-from-left-2">
            <div className="h-8 w-8 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center animate-pulse border border-violet-500/20">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-zinc-500 text-sm backdrop-blur-sm">
              <Loader2 className="h-3 w-3 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
        
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-black/20 border-t border-white/5 backdrop-blur-md">
        <div className="relative flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your project (e.g., 'I want to create a marketing video from text')..."
            className="min-h-[60px] max-h-[200px] bg-black/40 border-white/10 focus:border-violet-500/50 resize-none py-4 rounded-xl pr-12 text-zinc-200 placeholder:text-zinc-600"
          />
          <Button 
            size="icon" 
            className="absolute right-2 bottom-2 h-10 w-10 bg-violet-600 hover:bg-violet-500 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:scale-105"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            title="Send message"
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
        <div className="text-center mt-2">
             <p className="text-[10px] text-zinc-600 font-mono">
               Powered by Groq (Llama 3.3) & Google Gemini 1.5 Flash • Free Tier Architecture
             </p>
        </div>
      </div>
    </div>
  );
}
