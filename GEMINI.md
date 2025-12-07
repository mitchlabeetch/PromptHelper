# GEMINI.md - Context & Instruction File

## 1. Project Overview
**Project Name:** Prompt Architect (v2025.12)
**Directory:** `my-prompt-architect`
**Purpose:** A "Zero Cost" AI Prompt Engineer web application. It helps users analyze their project ideas, selects the perfect AI tool from a curated database of 68 models (e.g., Gemini, Claude, OpenAI, DeepSeek), and generates a specialized "Launch Plan" with optimized prompts based on a Best Practices Logic Tree.

**Core Philosophy:** "Sniper Scope" selection. Instead of generic advice, it strictly filters tools based on capabilities and constraints (e.g., "Free Tier Only", "No-Code") to find the single best match.

## 2. Technology Stack
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4, Shadcn/UI, Lucide React (Icons)
*   **State Management:** Zustand (`src/store/wizard.ts`)
*   **Validation:** Zod
*   **AI Integration:**
    *   **Google Generative AI SDK:** Primary Model (Gemini 1.5 Flash) for selection and planning.
    *   **Groq SDK:** Fallback Model (Llama 3.3 70B) for robustness.

## 3. Architecture & File Structure

### Key Directories
*   `src/app`: Next.js App Router pages and API endpoints.
    *   `page.tsx`: Main "Wizard" UI orchestrator.
    *   `api/architect/select`: Endpoint for analyzing user input and selecting a tool.
    *   `api/architect/plan`: Endpoint for generating the step-by-step launch plan.
*   `src/components/wizard`: Feature-specific UI components (`WizardInput`, `ToolReveal`, `PlanDisplay`).
*   `src/data`: Static knowledge bases.
    *   `tools_database.json`: The source of truth for 68 AI tools, specs, and scoring data.
    *   `best_practices.json`: The "Logic Tree" containing specific prompting strategies for each tool family.
*   `src/lib/selection`: Core business logic.
    *   `hard-filter.ts`: Deterministic filtering logic (e.g., removing paid tools if "Free Only" is checked).
*   `src/store`: Global state management.
    *   `wizard.ts`: Handles the multi-step wizard flow (`INPUT` -> `SELECTING` -> `CONFIRMATION` -> `PLANNING` -> `RESULT`).

### Key Files
*   **`CONTEXT.md`**: The original design specification and "Brain" of the project. Refer to this for architectural intent.
*   **`src/types/index.ts`**: Core type definitions for Tools and Plans.
*   **`src/types/selection.ts`**: Types regarding the selection algorithm (Capabilities, Tickboxes).

## 4. Development & Usage

### Setup
1.  **Environment Variables:**
    *   Copy `.env.local.example` to `.env.local`.
    *   Required Keys: `GOOGLE_API_KEY`, `GROQ_API_KEY`.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```

### Running the App
*   **Development Server:**
    ```bash
    npm run dev
    ```
    Access at `http://localhost:3000`.

### Building
*   **Production Build:**
    ```bash
    npm run build
    npm run start
    ```

## 5. Development Conventions
*   **Data Integrity:** Do not manually modify `src/data/tools_database.json` or `best_practices.json` without verifying the "Best Practice Path" mapping. These files must stay synchronized.
*   **State:** Use `useWizardStore` for all cross-component state. Avoid local state for data that persists across steps.
*   **Styling:** "Cyberpunk Lab" aesthetic. Dark mode (Zinc 950 backgrounds), Neon accents (Violet/Emerald).
*   **Logic:** The Selection logic is split into two phases:
    1.  **Hard Filter (Deterministic):** strictly removes invalid options (in `src/lib/selection/hard-filter.ts`).
    2.  **Sniper Scope (LLM):** scores the remaining candidates (in `api/architect/select/route.ts`).
