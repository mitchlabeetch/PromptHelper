import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Loader2, RefreshCw, Terminal } from "lucide-react";
import { MessageItem } from "./MessageItem";

export function ChatInterface() {
  const { messages, sendMessage, isLoading, resetChat } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col min-h-[50vh] max-h-[85vh] h-auto w-full max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-4">
      
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            onSendMessage={sendMessage}
          />
        ))}

        {isLoading && (
          <div className="flex gap-4 max-w-[90%] mr-auto animate-in fade-in slide-in-from-left-2">
            <div className="h-8 w-8 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center animate-pulse border border-violet-500/20">
              <Bot className="h-4 w-4" />
            </div>
            <div
              className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-zinc-500 text-sm backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
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
            placeholder="Tell me what you want to create (e.g., 'I want to build a marketing video for my startup')..."
            className="min-h-[60px] max-h-[200px] bg-black/40 border-white/10 focus:border-violet-500/50 resize-none py-4 rounded-xl pr-12 text-zinc-200 placeholder:text-zinc-600"
            aria-label="Message input"
          />
          <Button 
            size="icon" 
            className="absolute right-2 bottom-2 h-10 w-10 bg-violet-600 hover:bg-violet-500 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:scale-105"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
        {isLoading && (
          <div
            className="text-xs text-zinc-500 mt-1 animate-pulse ml-1"
            role="status"
            aria-live="polite"
          >
             AI Architect is typing...
          </div>
        )}
        <div className="text-center mt-2">
             <p className="text-[10px] text-zinc-600 font-mono">
               Powered by OpenRouter • Free Tier Architecture
             </p>
        </div>
      </div>
    </div>
  );
}
