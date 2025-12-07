import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import Groq from "groq-sdk";
import toolsDB from "@/data/tools_database.json";
import bestPractices from "@/data/best_practices.json";

// Input: The User Request + The Tool ID they selected
const PlanRequestSchema = z.object({
  userRequest: z.string(),
  selectedToolId: z.string()
});

// Output: The Launch Plan (Aligned with "User Dream" Spec)
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userRequest, selectedToolId } = PlanRequestSchema.parse(body);

    // 1. Fetch the specific tool data
    const mainTool = (toolsDB as any[]).find(t => t.id === selectedToolId);
    if (!mainTool) throw new Error("Invalid Tool ID");

    // 2. The Architect Prompt (Enhanced with "User Dream" Logic & Mega-Prompts)
    const systemPrompt = `
      ROLE: You are the "Prompt Architect".
      GOAL: Create a "Launch Plan" for the user's project.
      
      USER REQUEST: "${userRequest}"
      PRIMARY TOOL SELECTED: ${mainTool.name} (Primary Function: ${mainTool.primary_function})
      
      CORE PHILOSOPHY:
      - **Launch, don't stall:** If the project is huge, give them the first 3-5 critical steps to get started (Launch Pad).
      - **One Step = One Prompt:** Each step must be a concrete action with a copy-paste prompt.
      - **Tool Stack:** While ${mainTool.name} is the captain, you may recommend auxiliary tools (e.g., "Use ChatGPT for the script, then ${mainTool.name} for the video").

      SAFETY PROTOCOL (STRICT):
      - If the request involves illegal acts, malware, violence, or hate speech, REFUSE. Return JSON with "plan_title": "REQUEST DENIED".

      BEST PRACTICES KNOWLEDGE BASE:
      ${JSON.stringify(bestPractices)}
      TARGET PATH IN TREE: ${JSON.stringify(mainTool.best_practice_path)}

      INSTRUCTIONS:
      1. Analyze the 'TARGET PATH' strategies for ${mainTool.name}.
      2. Construct the "Tool Stack". If the user needs images but ${mainTool.name} is text-only, suggest an image generator for that specific step.
      3. Create the Steps. 
         - **Simple Project:** detailed full walkthrough.
         - **Complex Project:** "Launch Pad" (Setup -> Prototype -> First Output).
      
      CRITICAL: PROMPT QUALITY
      The 'prompt' field must NOT be a short sentence. It must be a **MEGA-PROMPT** designed for an LLM, following this structure:
      
      """
      # PROJECT CONTEXT
      [Deep dive into the user's goal, inferred needs, and style]

      # TECH STACK & ROLE
      [Specific tools involved, role definition for the AI]

      # OBJECTIVE
      [The specific goal of THIS step]

      # REQUIREMENTS & CONSTRAINTS
      - [List of strict constraints, e.g., "Local storage only", "No external APIs"]
      - [Output format requirements]

      # STEP INSTRUCTIONS
      [Step-by-step guide for the AI to execute]

      # META-INSTRUCTION
      "After generating the code/content, ask me about [X] to guide the next step."
      """
      
      OUTPUT JSON SCHEMA:
      {
        "plan_title": "Project Name (e.g., 'My App Launch')",
        "plan_description": "A mission statement and brief overview.",
        "tool_stack": [
           { 
             "tool_name": "Name", 
             "output_type": "Text/Image/Code", 
             "use_case": "One sentence purpose", 
             "involved_steps": [1, 2] 
           }
        ],
        "is_complete": boolean, // True if this plan finishes the *entire* user goal. False if it's just a "Launch Pad".
        "other_information": "Any extra advice, warnings, or format guides.",
        "steps": [
          {
            "step_number": 1,
            "title": "Actionable Title",
            "tool_used": "Tool Name for this step",
            "instruction": "Input this prompt into the tool...",
            "prompt": "THE ACTUAL MEGA-PROMPT CONTENT (Markdown formatted)",
            "troubleshooting_tip": "If output is X, try adding Y..."
          }
        ]
      }
    `;

    let rawJSON = "";

    // A. Attempt 1: Google Gemini 1.5 Flash (Free Tier)
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
      });

      rawJSON = result.response.text();

    } catch (geminiError) {
      console.warn("⚠️ Gemini Plan Gen Failed. Switching to Groq...", geminiError);

      // B. Attempt 2: Groq (Llama 3.3 70B Fallback)
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt + "\n\nRETURN JSON ONLY." }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      rawJSON = completion.choices[0]?.message?.content || "{}";
    }

    // 3. Validation & Parsing
    const json = JSON.parse(rawJSON);
    
    // Safety Catch
    if (json.plan_title === "REQUEST DENIED") {
        return NextResponse.json({ error: "Safety Guardrail Triggered: Request Refused." }, { status: 400 });
    }

    // Validate against our new schema
    const validated = PlanResponseSchema.parse(json);

    return NextResponse.json(validated);

  } catch (error) {
    console.error("Plan Gen Error:", error);
    return NextResponse.json({
        error: "Failed to generate plan. Please try again.", 
        details: error instanceof Error ? error.message : "Unknown"
    }, { status: 500 });
  }
}
