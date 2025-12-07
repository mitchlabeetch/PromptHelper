# PROJECT: PROMPT ARCHITECT (Production Build)

## 1. MISSION
Build a "Zero Cost" web app that acts as a Prompt Engineer.
**Flow:**
1. **Input:** User describes idea + Ticks capability boxes (Code, Image, etc.).
2. **Selection (API):** System analyzes constraints and selects the ONE perfect tool.
3. **Review (UI):** User sees the selected tool and rationale. Clicks "Generate Plan".
4. **Plan (API):** System generates optimized prompts using the Best Practices Tree.

## 2. CORE ASSETS (ALREADY PROVIDED - DO NOT OVERWRITE)
I have already manually created the complex logic files. **Do not hallucinate new versions of these.** Use them as imports.
- Data: `src/data/tools_database.json` (68 Tools)
- Data: `src/data/best_practices.json` (Logic Tree)
- Logic: `src/lib/selection/hard-filter.ts`
- Logic: `src/app/api/architect/select/route.ts` (Selection Endpoint)
- Logic: `src/app/api/architect/plan/route.ts` (Plan Endpoint)
- Types: `src/types/`

## 3. UI REQUIREMENTS (WIZARD)
**Tech:** Next.js 15 (App Router), Tailwind, Shadcn/UI, Zustand.

### State Management (`useWizardStore`)
- `userRequest`: string
- `constraints`: { freeOnly: boolean, noCode: boolean }
- `capabilities`: string[] (Text, Image, Code...)
- `selectedTool`: Tool | null (Result from /select)
- `finalPlan`: LaunchPlan | null (Result from /plan)
- `step`: 'INPUT' | 'SELECTING' | 'CONFIRMATION' | 'PLANNING' | 'RESULT'

### Components needed:
1.  **`WizardInput.tsx`**:
    - Textarea (min 10 chars).
    - **Capability Toggles:** A row of toggle buttons (Text, Code, Image, Video...).
    - "Free Only" Switch (Default: True).
2.  **`ToolReveal.tsx`**:
    - Shows the "Winner" tool card with `rationale` and `fit_score`.
    - Button: "Proceed with [Tool Name]" (Triggers /api/architect/plan).
3.  **`PlanDisplay.tsx`**:
    - Accordion view of the steps.
    - **Crucial:** The `optimized_prompt` must be in a code block with a "Copy" button.

## 4. DESIGN AESTHETIC
- **Vibe:** "Cyberpunk Lab". Dark mode.
- **Colors:** Zinc backgrounds (950), Neon accents (Violet/Emerald).
- **Font:** Inter (UI), JetBrains Mono (Code).