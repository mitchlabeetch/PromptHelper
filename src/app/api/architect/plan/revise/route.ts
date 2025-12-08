import { NextResponse } from "next/server";
import { z } from "zod";
import { callOpenRouter, parseJSONResponse } from "@/lib/api/openrouter";

// Input: The Current Plan + Revision Instruction
const ReviseRequestSchema = z.object({
  currentPlan: z.any(),
  userInstruction: z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currentPlan, userInstruction } = ReviseRequestSchema.parse(body);

    const systemPrompt = `
      ROLE: You are the "Prompt Architect" refining a plan.
      GOAL: Modify the existing Launch Plan based on the user's feedback.
      
      CURRENT PLAN:
      ${JSON.stringify(currentPlan)}
      
      USER FEEDBACK:
      "${userInstruction}"
      
      INSTRUCTIONS:
      1. Review the user's feedback carefully.
      2. Modify only the relevant parts ('steps', 'tool_stack', or 'plan_description').
      3. Keep the JSON structure IDENTICAL to the original plan.
      4. Do NOT regenerate everything if only one step needs changing.
      
      OUTPUT THE COMPLETE REVISED PLAN AS JSON ONLY.
    `;

    const { content: rawJSON } = await callOpenRouter("planning", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Apply this revision: "${userInstruction}"` }
      ],
      temperature: 0.3,
      maxTokens: 8192,
      jsonMode: true
    });

    const json = parseJSONResponse(rawJSON);
    return NextResponse.json(json);

  } catch (error) {
    console.error("Revision Error:", error);
    
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ 
      error: "Failed to revise plan. Please try again.",
      details: message
    }, { status: 500 });
  }
}
