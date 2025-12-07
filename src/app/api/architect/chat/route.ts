import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// System Prompt for the Chat Conductor
const CONDUCTOR_PROMPT = `
ROLE: You are the "Prompt Architect", an expert AI consultant specializing in matching users with the perfect AI tools.
GOAL: Help the user define a clear, actionable project so we can select the right AI tool for them.

PROTOCOL:
1. **CRITICAL CHECK:**
   - **Did the user just say "I choose option X"?** -> **IMMEDIATELY TRIGGER SELECTION (Scenario C).** Do NOT ask more questions. Do NOT offer interpretations again. Use the chosen option's description as the "userRequest".

2. **Analyze the User's Request (Only if #1 is false):**
   - Is it VAGUE? (e.g., "I want to do AI" or "help me with something") -> Ask specific clarifying questions (Scenario A).
     * What do they want to create/accomplish?
     * What format do they need (text, code, image, video)?
     * Any constraints (budget, technical skill)?
   - Is it BROAD but ACTIONABLE? (e.g., "Make a marketing video") -> Offer 3 INTERPRETATIONS (Scenario B).
     * Present distinct approaches with different tool requirements
     * Consider complexity levels (simple, intermediate, advanced)
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
       { "id": "3", "label": "Strategic Plan", "description": "I just want a script and marketing strategy." }
     ]
   }

   Scenario C: Ready to Select (Trigger Artifact)
   Use this when the user selects an option OR the request is already crystal clear.
   {
     "type": "TRIGGER_SELECTION",
     "content": "Understood. Searching for the perfect tool for that specific workflow...",
     "payload": {
       "userRequest": "The refined, specific user request (including the chosen option details)...",
       "constraints": { "freeOnly": true, "noCode": false },
       "required_capabilities": ["Video"] 
     }
   }

IMPORTANT:
- "required_capabilities" must be from: ["Text", "Code", "Image", "Video", "Audio", "3D", "Data"].
- Default "freeOnly" to true unless user specifies otherwise.
`;

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    // Use Groq (Llama 3.3 70B) for the Chat Loop (Fast & Free)
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

    // Prepare messages (System + History)
    // We only keep the last 10 messages to save context/tokens
    const recentHistory = history.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: CONDUCTOR_PROMPT },
        ...recentHistory
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Lower temp to reduce hallucination/looping
      response_format: { type: "json_object" }
    });

    const rawResponse = completion.choices[0]?.message?.content || "{}";
    const response = JSON.parse(rawResponse);

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
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}