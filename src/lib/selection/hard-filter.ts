import { Tool } from "@/types";
import toolsDB from "@/data/tools_database.json";
import { SelectionRequest } from "@/types/selection";

export function filterCandidates(request: SelectionRequest): Tool[] {
  const { constraints, required_capabilities } = request;
  const allTools = toolsDB as Tool[];

  return allTools.filter((tool) => {
    // 1. Cost Filter
    if (constraints.freeOnly && !tool.has_free_tier) return false;

    // 2. No-Code Filter
    if (constraints.noCode && (tool.tags.includes("IDE") || tool.tags.includes("API") || tool.tags.includes("CLI"))) return false;

    // 3. Capability Filter (Smart Matching)
    const matchesCap = required_capabilities.some(cap => {
      if (tool.category === cap) return true;
      if (cap === "Code" && tool.tags.includes("Reasoning")) return true;
      if (cap === "Text" && tool.tags.includes("Agentic")) return true;
      if (cap === "Data" && tool.tags.includes("Research")) return true;
      return false;
    });

    return matchesCap;
  });
}