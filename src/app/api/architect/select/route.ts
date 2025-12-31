import { NextResponse } from "next/server";
import { callOpenRouter, parseJSONResponse } from "@/lib/api/openrouter";
import { rateLimiter } from "@/lib/rate-limit";
import { getIP } from "@/lib/utils/ip";
import { SelectionRequestSchema } from "@/types/selection";
import { filterCandidates } from "@/lib/selection/hard-filter";

const InputSchema = SelectionRequestSchema;

export async function POST(req: Request) {
  try {
    const ip = getIP(req);

    if (!rateLimiter.check(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // A. Parse Body
    const body = await req.json();
    const parsedBody = InputSchema.parse(body);
    const { userRequest, constraints } = parsedBody;

    // B. Hard Filter (Deterministic)
    const candidates = filterCandidates(parsedBody);

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "No tools match your filters. Try unchecking 'Free Only' or adding more capabilities." }, 
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

    // D. The "Sniper Scope" System Prompt
    const systemPrompt = `
      ROLE: Chief Architect. 
      TASK: Select ONE best tool for the user.
      
      USER REQUEST: "${userRequest}"
      USER CONSTRAINTS: [${constraints.freeOnly ? "Free Tier Only" : "Any Budget"}, ${constraints.noCode ? "No Code Tools" : "Code Allowed"}]
      
      SAFETY PROTOCOL (STRICT):
      - If the user request involves illegal acts, malware, violence, or self-harm, REFUSE to process. Return a JSON with "winner_id": "REFUSAL" and "reasoning_summary": "Safety violation.".

      CANDIDATE TOOLS:
      ${JSON.stringify(candidateContext)}

      ALGORITHM:
      1. **Intent Analysis:** 
         - "Plan", "Solve", "Math" -> Prioritize 'reasoning_level'.
         - "Chat", "Write", "Fast" -> Prioritize 'speed_level'.
         - "Build App" -> Prioritize 'coding_level' & 'ease_of_use'.
      
      2. **Scoring (0-100):**
         - Base Score = (Fit to Intent * 50%) + (Specs Match * 30%) + (Ease * 20%).
         - **Overkill Penalty:** -20 points for PhD model on simple task.
         - **Underkill Penalty:** -30 points for fast chat on complex architecture.

      OUTPUT FORMAT (JSON Only):
      {
        "reasoning_summary": "User wants X, which requires High Reasoning...",
        "candidates_scored": [
           { "tool_id": "...", "fit_score": 85, "penalty_reason": "Slight overkill" }
        ],
        "winner_id": "THE_ID_WITH_HIGHEST_SCORE",
        "auxiliary_tool_ids": ["ID_1", "ID_2"] 
      }
      
      AUXILIARY TOOLS:
      - Select 1-3 *complementary* tools to form a "Squad".
      - Do NOT include the 'winner_id' in this list.
      - If no other tools are needed, return an empty array [].
    `;

    // E. Execute via OpenRouter
    const { content: rawJSON } = await callOpenRouter("selection", {
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.1,
      jsonMode: true
    });

    // F. Validation & Hydration
    const json = parseJSONResponse(rawJSON) as {
      winner_id: string;
      reasoning_summary: string;
      auxiliary_tool_ids?: string[];
      candidates_scored?: Array<{ tool_id: string; fit_score: number; penalty_reason?: string }>;
    };

    // Safety Check
    if (json.winner_id === "REFUSAL") {
      return NextResponse.json({ error: "Safety Violation: Request refused." }, { status: 400 });
    }

    // Validate winner
    const winnerTool = candidates.find(t => t.id === json.winner_id);
    if (!winnerTool) {
      console.error(`LLM Selected Invalid ID: ${json.winner_id}. Candidates: ${candidates.map(c => c.id).join(', ')}`);
      // Fallback to first candidate if LLM hallucinated
      const fallbackTool = candidates[0];
      return NextResponse.json({
        selection: { ...json, winner_id: fallbackTool.id },
        tool: fallbackTool,
        auxiliary_tools: []
      });
    }

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
    
    const message = error instanceof Error ? error.message : "Unknown error";
    const isApiKeyIssue = message.includes("OPENROUTER_API_KEY");
    
    return NextResponse.json(
      { 
        error: isApiKeyIssue 
          ? "API configuration issue. Please check your settings." 
          : "Selection failed. Please try again.",
        details: message
      },
      { status: 500 }
    );
  }
}