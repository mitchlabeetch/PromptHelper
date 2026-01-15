import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { callOpenRouter, parseJSONResponse } from "@/lib/api/openrouter";
import { rateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils/ip";
import toolsDB from "@/data/tools_database.json";
import bestPractices from "@/data/best_practices.json";

// Input: The User Request + The Tool ID they selected
const PlanRequestSchema = z.object({
  userRequest: z.string(),
  selectedToolId: z.string()
});

// Output: The Launch Plan
const PlanResponseSchema = z.object({
  plan_title: z.string(),
  plan_description: z.string(),
  tool_stack: z.array(z.object({
    tool_name: z.string(),
    output_type: z.string(),
    use_case: z.string(),
    involved_steps: z.array(z.number())
  })),
  is_complete: z.boolean(),
  other_information: z.string().optional(),
  steps: z.array(z.object({
    step_number: z.number(),
    title: z.string(),
    tool_used: z.string(),
    instruction: z.string(),
    prompt: z.string(),
    troubleshooting_tip: z.string().optional()
  }))
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (!rateLimiter.check(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { userRequest, selectedToolId } = PlanRequestSchema.parse(body);

    // 1. Fetch the specific tool data
    const mainTool = (toolsDB as Array<{ id: string; name: string; primary_function: string; best_practice_path: string[] }>).find(t => t.id === selectedToolId);
    if (!mainTool) throw new Error("Invalid Tool ID");

    // 2. The Architect System Prompt
    const systemPrompt = `
      ROLE: You are the "Prompt Architect".
      GOAL: Create a "Launch Plan" for the user's project.
      
      USER REQUEST: "${userRequest}"
      PRIMARY TOOL: ${mainTool.name} (${mainTool.primary_function})
      
      PHILOSOPHY:
      - **Launch, don't stall:** For big projects, give 3-5 critical starting steps.
      - **One Step = One Prompt:** Each step has a concrete copy-paste prompt.
      - **Tool Stack:** You may recommend auxiliary tools when needed.

      SAFETY PROTOCOL:
      - If the request involves illegal acts, malware, or violence, REFUSE. Return "plan_title": "REQUEST DENIED".

      BEST PRACTICES DATABASE:
      ${JSON.stringify(bestPractices)}
      TARGET PATH: ${JSON.stringify(mainTool.best_practice_path)}

      CRITICAL - PROMPT QUALITY:
      The 'prompt' field must be a **MEGA-PROMPT**, not a short sentence. Structure:
      
      """
      # PROJECT CONTEXT
      [Deep dive into the user's goal and style]

      # ROLE & TECH STACK
      [Specific tools, role definition for the AI]

      # OBJECTIVE
      [The specific goal of THIS step]

      # REQUIREMENTS & CONSTRAINTS
      - [List of constraints e.g., "Local storage only"]
      - [Output format requirements]

      # STEP-BY-STEP INSTRUCTIONS
      [Detailed guide for the AI to execute]

      # META-INSTRUCTION
      "After generating, ask me about [X] to guide the next step."
      """
      
      OUTPUT JSON SCHEMA:
      {
        "plan_title": "Project Name",
        "plan_description": "Mission statement and brief overview.",
        "tool_stack": [
           { 
             "tool_name": "Name", 
             "output_type": "Text/Image/Code", 
             "use_case": "One sentence purpose", 
             "involved_steps": [1, 2] 
           }
        ],
        "is_complete": true/false, // True if this completes the goal
        "other_information": "Extra advice or warnings.",
        "steps": [
          {
            "step_number": 1,
            "title": "Actionable Title",
            "tool_used": "Tool Name",
            "instruction": "What to do with this prompt...",
            "prompt": "THE FULL MEGA-PROMPT CONTENT (Markdown formatted)",
            "troubleshooting_tip": "If output is X, try adding Y..."
          }
        ]
      }
    `;

    // Execute via OpenRouter
    const { content: rawJSON } = await callOpenRouter("planning", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a launch plan for: "${userRequest}"` }
      ],
      temperature: 0.4,
      maxTokens: 8192,
      jsonMode: true
    });

    // Validation & Parsing
    const json = parseJSONResponse(rawJSON);
    
    // Safety Check
    if ((json as { plan_title?: string }).plan_title === "REQUEST DENIED") {
      return NextResponse.json({ error: "Safety Guardrail Triggered: Request Refused." }, { status: 400 });
    }

    // Validate against schema
    const validated = PlanResponseSchema.parse(json);

    return NextResponse.json(validated);

  } catch (error) {
    console.error("Plan Gen Error:", error);
    
    const message = error instanceof Error ? error.message : "Unknown error";
    const isApiKeyIssue = message.includes("OPENROUTER_API_KEY");
    
    return NextResponse.json({
      error: isApiKeyIssue 
        ? "API configuration issue. Please check your settings."
        : "Failed to generate plan. Please try again.", 
      details: message
    }, { status: 500 });
  }
}
