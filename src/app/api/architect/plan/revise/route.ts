import {
  GoogleGenerativeAI
} from "@google/generative-ai";
import {
  NextResponse
} from "next/server";
import {
  z
} from "zod";
import Groq from "groq-sdk";

// Input: The User Request + Current Plan + Revision Instruction
const ReviseRequestSchema = z.object({
  currentPlan: z.any(), // We trust the structure for now, or could import LaunchPlanSchema
  userInstruction: z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currentPlan, userInstruction } = ReviseRequestSchema.parse(body);

    const systemPrompt = `
      ROLE: You are the "Prompt Architect" fixing a plan.
      GOAL: Modify the existing Launch Plan based on the user's feedback.
      
      CURRENT PLAN:
      ${JSON.stringify(currentPlan)}
      
      USER FEEDBACK:
      "${userInstruction}"
      
      INSTRUCTIONS:
      1. Review the feedback.
      2. Modify the 'steps', 'tool_stack', or 'plan_description' accordingly.
      3. Keep the structure IDENTICAL to the original plan.
      4. Do NOT regenerate the whole thing from scratch if only one step needs changing.
      
      OUTPUT JSON ONLY.
    `;

    let rawJSON = "";

    // A. Attempt 1: Gemini 1.5 Flash
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
      // B. Fallback: Groq
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt + "\n\nRETURN JSON ONLY." }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      rawJSON = completion.choices[0]?.message?.content || "{}";
    }

    const json = JSON.parse(rawJSON);
    return NextResponse.json(json);

  } catch (error) {
    console.error("Revision Error:", error);
    return NextResponse.json({ error: "Failed to revise plan" }, { status: 500 });
  }
}
