import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { SelectionRequestSchema, SelectionResponseSchema } from "@/types/selection";
import { filterCandidates } from "@/lib/selection/hard-filter";

// Re-export schema for internal use if needed
const InputSchema = SelectionRequestSchema;

export async function POST(req: Request) {
  try {
    // A. Parse Body
    const body = await req.json();
    const parsedBody = InputSchema.parse(body);
    const { userRequest, constraints } = parsedBody;

    // B. Hard Filter (Deterministic)
    const candidates = filterCandidates(parsedBody);

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "No tools match your strict filters. Try unchecking 'Free Only' or adding more capabilities." }, 
        { status: 400 }
      );
    }

    // C. Context Minification (Save Tokens)
    const candidateContext = candidates.map(t => ({
      id: t.id,
      name: t.name,
      type: t.tags.join(", "),
      specs: t.specs,
      use_case: t.ideal_use_case,
      is_reasoning_engine: t.best_practice_path.includes("reasoning_engine")
    }));

    // D. The "Sniper Scope" System Prompt (Enhanced with Safety)
    const systemPrompt = `
      ROLE: Chief Architect. 
      TASK: Select ONE best tool for the user.
      
      USER REQUEST: "${userRequest}"
      USER CONSTRAINTS: [${constraints.freeOnly ? "Free Tier Only" : "Any Budget"}, ${constraints.noCode ? "No Code Tools" : "Code Allowed"}]
      
      SAFETY PROTOCOL (STRICT):
      - If the user request involves illegal acts, malware, violence, or self-harm, REFUSE to process. Return a JSON with "winner_id": "REFUSAL" and "reasoning_summary": "Safety violation.".

      CANDIDATE TOOLS:
      ${JSON.stringify(candidateContext)}

      ALGORITHM (Mental Scratchpad):
      1. **Intent Analysis:** 
         - "Plan", "Solve", "Math" -> Prioritize 'reasoning_level' (System 2).
         - "Chat", "Write", "Fast" -> Prioritize 'speed_level' (System 1).
         - "Build App" -> Prioritize 'coding_level' & 'ease_of_use'.
      
      2. **Scoring (0-100):**
         - Base Score = (Fit to Intent * 50%) + (Specs Match * 30%) + (Ease * 20%).
         - **Overkill Penalty:** Subtract 20 points if using a "PhD Reasoning" model for a simple greeting/summary.
         - **Underkill Penalty:** Subtract 30 points if using a "Fast Chat" model for complex architecture.

      OUTPUT FORMAT (JSON Only):
      {
        "reasoning_summary": "User wants X, which requires High Reasoning...",
        "candidates_scored": [
           { "tool_id": "...", "fit_score": 85, "penalty_reason": "Slight overkill" }
        ],
        "winner_id": "THE_ID_WITH_HIGHEST_SCORE",
        "auxiliary_tool_ids": ["ID_1", "ID_2"] 
      }
      
      CRITICAL FOR AUXILIARY TOOLS:
      - Select 1-3 *complementary* tools from the candidate list to form a "Squad".
      - Do NOT include the 'winner_id' in this list.
      - If the winner is a text LLM, suggest Image/Video/Audio tools if the user request implies them.
      - If no other tools are needed, return an empty array [].
    `;

    // E. Execution (Gemini -> Fallback Groq)
    let rawJSON = "";
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      
      const result = await model.generateContent(systemPrompt);
      rawJSON = result.response.text();
      
    } catch (geminiError) {
      console.warn("⚠️ Gemini Selection Failed. Switching to Groq...", geminiError);
      
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt + "\n\nRETURN JSON ONLY." }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        response_format: { type: "json_object" }
      });
      rawJSON = completion.choices[0]?.message?.content || "{}";
    }

    // F. Validation & Hydration
    const json = JSON.parse(rawJSON);

    // Safety Check
    if (json.winner_id === "REFUSAL") {
        return NextResponse.json({ error: "Safety Violation: Request refused." }, { status: 400 });
    }

    // Soft validation for the main winner
    const winnerTool = candidates.find(t => t.id === json.winner_id);
    if (!winnerTool) throw new Error(`LLM Selected Invalid ID: ${json.winner_id}`);

    // Hydrate Auxiliaries
    const auxiliaryTools = (json.auxiliary_tool_ids || [])
        .map((id: string) => candidates.find(t => t.id === id))
        .filter(Boolean);

    return NextResponse.json({
      selection: json,
      tool: winnerTool,
      auxiliary_tools: auxiliaryTools
    });

  } catch (error) {
    console.error("Selection Pipeline Error:", error);
    return NextResponse.json(
      { error: "Selection failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}