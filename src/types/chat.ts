// Types for chat functionality

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  artifact?: ChatArtifact; // Optional UI element attached to message
}

export type ArtifactType = "TOOL_SELECTION" | "LAUNCH_PLAN" | "AMBIGUITY_CHECK" | "INTERPRETATION_OPTIONS";

export interface ChatArtifact {
  type: ArtifactType;
  data: Record<string, unknown>; // Generic object type for flexibility
}

// State for the Chat Store
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  streamingContent: string; // For future streaming support
  
  // Actions
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
}
