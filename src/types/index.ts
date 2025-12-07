export type ToolCategory = "Text" | "Code" | "Image" | "Video" | "Audio" | "3D" | "Data";

export interface ToolSpecs {
  reasoning_level: number; // 1-10
  coding_level: number;    // 1-10
  speed_level: number;     // 1-10
  ease_of_use: number;     // 1-10
}

export interface Tool {
  id: string;
  name: string;
  provider: string;
  website_url: string;
  category: ToolCategory;
  tags: string[];
  description: string;
  pricing_summary: string;
  primary_function: string;
  requires_subscription: boolean;
  has_free_tier: boolean;
  best_practice_path: string[];
  specs: ToolSpecs;
  ideal_use_case: string;
}

export interface ToolStackItem {
  tool_name: string;
  output_type: string;
  use_case: string;
  involved_steps: number[];
}

export interface LaunchPlanStep {
  step_number: number;
  title: string;
  tool_used: string;
  instruction: string;
  prompt: string;
  troubleshooting_tip?: string;
}

export interface LaunchPlan {
  plan_title: string;
  plan_description: string;
  tool_stack: ToolStackItem[];
  is_complete: boolean;
  other_information?: string;
  steps: LaunchPlanStep[];
}