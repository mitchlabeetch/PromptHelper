/**
 * OpenRouter API Client
 * Unified gateway for LLM access with automatic fallback
 */

// Model configurations with free tier priorities
export const MODELS = {
  // For chat/conversation - fast, free
  chat: {
    primary: "meta-llama/llama-3.3-70b-instruct:free",
    fallback: "deepseek/deepseek-r1:free"
  },
  // For selection/reasoning - smarter
  selection: {
    primary: "meta-llama/llama-3.3-70b-instruct:free",
    fallback: "deepseek/deepseek-r1:free"
  },
  // For plan generation - creative + structured
  planning: {
    primary: "meta-llama/llama-3.3-70b-instruct:free",
    fallback: "deepseek/deepseek-r1:free"
  }
} as const;

export type ModelCategory = keyof typeof MODELS;

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ChatOptions {
  messages: OpenRouterMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

/**
 * Call OpenRouter API with automatic fallback
 */
export async function callOpenRouter(
  category: ModelCategory,
  options: ChatOptions
): Promise<{ content: string; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured. Please add it to your .env.local file.");
  }

  const models = [MODELS[category].primary, MODELS[category].fallback];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const response = await fetchWithTimeout(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://whiteinputsyndrome.dev",
            "X-Title": "Prompt Architect"
          },
          body: JSON.stringify({
            model: options.model || model,
            messages: options.messages,
            temperature: options.temperature ?? 0.3,
            max_tokens: options.maxTokens ?? 4096,
            ...(options.jsonMode && {
              response_format: { type: "json_object" }
            })
          })
        },
        30000 // 30 second timeout
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `OpenRouter API error: ${response.status} ${response.statusText}`
        );
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from model");
      }

      return { content, model };

    } catch (error) {
      console.warn(`⚠️ Model ${model} failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to fallback model
    }
  }

  throw lastError || new Error("All models failed");
}

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse JSON from potentially markdown-wrapped response
 */
export function parseJSONResponse(content: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(content);
  } catch {
    // Try to extract from markdown code block
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    // Try to find JSON object directly
    const objectMatch = content.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error("Could not parse JSON from response");
  }
}
