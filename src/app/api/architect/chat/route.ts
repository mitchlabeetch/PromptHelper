import { NextResponse } from "next/server";
import { z } from "zod";
import { callOpenRouter, parseJSONResponse } from "@/lib/api/openrouter";
import { rateLimiter } from "@/lib/rate-limit";
import { getIP } from "@/lib/utils/ip";

// Schema for input validation
const ChatRequestSchema = z.object({
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(20000) // Limit content length to prevent DoS
  })).max(50) // Limit history length to prevent DoS
});

// System Prompt for the Chat Conductor
const CONDUCTOR_PROMPT = `
ROLE: You are the "Prompt Architect", an expert AI consultant.
GOAL: Help the user define a clear technical project so we can select the right AI tool for them.

PROTOCOL:
1. **CRITICAL CHECK:**
   - **Did the user just say "I choose option X"?** -> **IMMEDIATELY TRIGGER SELECTION (Scenario C).** Do NOT ask more questions. Do NOT offer interpretations again. Use the chosen option's description as the "userRequest".

2. **Analyze the User's Request (Only if #1 is false):**
   - Is it VAGUE? (e.g., "I want to do AI") -> Ask clarification (Scenario A).
   - Is it BROAD but ACTIONABLE? (e.g., "Make a marketing video") -> Offer 3 INTERPRETATIONS (Scenario B).
   - Is it PRECISE or CONFIRMED? -> Trigger SELECTION (Scenario C).

3. **Output Format (JSON Only):**

   Scenario A: Need more info (Chatting)
   {
     "type": "MESSAGE",
     "content": "To recommend the best tool, do you want to create the video yourself or have an AI generate it entirely?"
   }

   Scenario B: Offer Interpretations (Crucial Step)
   If the user's idea is understood but could be executed in different ways, offer 3 distinct paths.
   {
     "type": "INTERPRETATIONS",
     "content": "I see a few ways to approach this. Which one matches your vision?",
     "options": [
       { "id": "1", "label": "Full Automation", "description": "I want an AI to generate the video from zero." },
       { "id": "2", "label": "Assistant Mode", "description": "I want to edit the video myself but need AI assets." },
       { "id": "3", "label": "Strategic Plan", "description": "I just need a script and marketing strategy." }
     ]
   }

   Scenario C: Ready to Select (Trigger Artifact)
   Use this when the user selects an option OR the request is already crystal clear.
   {
     "type": "TRIGGER_SELECTION",
     "content": "Got it! Searching for the perfect tool for your workflow...",
     "payload": {
       "userRequest": "The refined, specific user request (including the chosen option details)...",
       "constraints": { "freeOnly": true, "noCode": false },
       "required_capabilities": ["Video"] 
     }
   }

IMPORTANT:
- "required_capabilities" must be from: ["Text", "Code", "Image", "Video", "Audio", "3D", "Data"].
- Default "freeOnly" to true unless user specifies otherwise.
- Be friendly and conversational, not robotic.
`;

export async function POST(req: Request) {
  try {
    const ip = getIP(req);

    if (!rateLimiter.check(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Validate request body
    const validation = ChatRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { history } = validation.data;

    // Prepare messages (System + History)
    // Keep last 10 messages to save context/tokens
    const recentHistory = history.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content
    }));

    const { content: rawResponse } = await callOpenRouter("chat", {
      messages: [
        { role: "system", content: CONDUCTOR_PROMPT },
        ...recentHistory
      ],
      temperature: 0.3,
      jsonMode: true
    });

    const response = parseJSONResponse(rawResponse) as {
      type: string;
      content: string;
      options?: Array<{ id: string; label: string; description: string }>;
      payload?: {
        userRequest: string;
        constraints: { freeOnly: boolean; noCode: boolean };
        required_capabilities: string[];
      };
    };

    // Handle Artifacts
    let artifact = null;

    if (response.type === "TRIGGER_SELECTION") {
      artifact = {
        type: "TOOL_SELECTION",
        data: response.payload
      };
    } else if (response.type === "INTERPRETATIONS") {
      artifact = {
        type: "INTERPRETATION_OPTIONS",
        data: response.options
      };
    }

    return NextResponse.json({
      content: response.content,
      artifact: artifact
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Provide helpful error message
    const message = error instanceof Error ? error.message : "Unknown error";
    const isApiKeyIssue = message.includes("OPENROUTER_API_KEY");
    
    return NextResponse.json({ 
      error: isApiKeyIssue 
        ? "API configuration issue. Please check your settings."
        : "I'm having trouble connecting right now. Please try again in a moment."
    }, { status: 500 });
  }
}
