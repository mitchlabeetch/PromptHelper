import { z } from "zod";

export const CapabilityEnum = z.enum(["Text", "Code", "Image", "Video", "Audio", "3D", "Data"]);
export type Capability = z.infer<typeof CapabilityEnum>;

export const SelectionRequestSchema = z.object({
  userRequest: z.string().min(5),
  constraints: z.object({
    freeOnly: z.boolean().default(true),
    noCode: z.boolean().default(false),
  }),
  required_capabilities: z.array(CapabilityEnum).min(1),
});

export type SelectionRequest = z.infer<typeof SelectionRequestSchema>;

export const SelectionResponseSchema = z.object({
  winner_id: z.string(),
  reasoning_summary: z.string(),
  candidates_scored: z.array(z.object({
    tool_id: z.string(),
    fit_score: z.number(),
    penalty_reason: z.string().optional()
  }))
});
export type SelectionResponse = z.infer<typeof SelectionResponseSchema>;