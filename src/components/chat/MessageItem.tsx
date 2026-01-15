import React, { memo } from "react";
import { clsx } from "clsx";
import { Bot, User } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { ToolRevealArtifact } from "./ToolRevealArtifact";
import ReactMarkdown from 'react-markdown';

interface MessageItemProps {
  message: ChatMessage;
  onSendMessage: (content: string) => void;
}

const MessageItem = memo(({ message, onSendMessage }: MessageItemProps) => {
  return (
    <div
      className={clsx(
        "flex gap-4 max-w-[90%]",
        message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto animate-in fade-in slide-in-from-left-2 duration-300"
      )}
    >
      {/* AVATAR */}
      <div className={clsx(
        "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
        message.role === "assistant" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50"
      )}>
        {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* CONTENT */}
      <div className="space-y-2 max-w-full">
        <div className={clsx(
          "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
          message.role === "user"
            ? "bg-violet-600/10 border border-violet-500/20 text-violet-100 rounded-tr-none backdrop-blur-sm whitespace-pre-wrap"
            : "bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none backdrop-blur-sm prose prose-invert prose-sm max-w-none"
        )}>
           {message.role === "assistant" ? (
             <ReactMarkdown
               components={{
                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
                 a: ({ node, children, ...props }) => (
                   <a
                     {...props}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
                   >
                     {children}
                     <span className="sr-only"> (opens in a new tab)</span>
                   </a>
                 ),
               }}
             >
               {message.content}
             </ReactMarkdown>
           ) : (
             message.content
           )}
        </div>

        {/* ARTIFACT RENDERER */}
        {message.artifact && message.artifact.type === "TOOL_SELECTION" && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ToolRevealArtifact selectionData={message.artifact.data} />
          </div>
        )}

        {/* INTERPRETATION OPTIONS RENDERER */}
        {message.artifact && message.artifact.type === "INTERPRETATION_OPTIONS" && (
          <div className="mt-4 grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {message.artifact.data.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => onSendMessage(`I choose option ${option.id}: ${option.label}. ${option.description}`)}
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
                onClick={() => onSendMessage("None of these really fit what I have in mind. I'll explain more.")}
                className="text-center p-3 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-lg transition-colors"
             >
                None of these fit perfectly
             </button>
          </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export { MessageItem };
