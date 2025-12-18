import React, { memo, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import { Bot, Loader2 } from "lucide-react";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

const MessageList = memo(({ messages, isLoading, onSendMessage }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          onSendMessage={onSendMessage}
        />
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
  );
});

MessageList.displayName = "MessageList";

export { MessageList };
