import { create } from 'zustand';
import { Tool, LaunchPlan } from '@/types';
import { SelectionRequest, Capability } from '@/types/selection';
import { useChatStore } from './chat'; // Import Chat Store to sync resets

type WizardStep = 'INPUT' | 'SELECTING' | 'CONFIRMATION' | 'PLANNING' | 'RESULT';

interface WizardState {
  // DATA
  userRequest: string;
  capabilities: Capability[];
  constraints: {
    freeOnly: boolean;
    noCode: boolean;
  };
  selectedTool: Tool | null;
  finalPlan: LaunchPlan | null;
  
  // UI STATE
  step: WizardStep;
  isLoading: boolean;
  error: string | null;

  // ACTIONS
  setUserRequest: (req: string) => void;
  toggleCapability: (cap: Capability) => void;
  toggleConstraint: (key: 'freeOnly' | 'noCode') => void;
  setSelectedTool: (tool: Tool) => void;
  setFinalPlan: (plan: LaunchPlan) => void;
  updateStepPrompt: (stepNumber: number, newPrompt: string) => void;
  setStep: (step: WizardStep) => void;
  
  // API ACTIONS
  submitSelection: () => Promise<void>;
  submitPlan: () => Promise<void>;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  // INITIAL STATE
  userRequest: "",
  capabilities: ["Text"], // Default
  constraints: { freeOnly: true, noCode: false },
  selectedTool: null,
  finalPlan: null,
  step: 'INPUT',
  isLoading: false,
  error: null,

  // ACTIONS
  setUserRequest: (req) => set({ userRequest: req }),
  
  toggleCapability: (cap) => set((state) => {
    const exists = state.capabilities.includes(cap);
    if (exists) {
      // Prevent removing the last one
      if (state.capabilities.length === 1) return state;
      return { capabilities: state.capabilities.filter(c => c !== cap) };
    }
    return { capabilities: [...state.capabilities, cap] };
  }),

  toggleConstraint: (key) => set((state) => ({
    constraints: { ...state.constraints, [key]: !state.constraints[key] }
  })),

  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setFinalPlan: (plan) => set({ finalPlan: plan }),
  
  updateStepPrompt: (stepNumber, newPrompt) => set((state) => {
    if (!state.finalPlan) return state;
    
    const newSteps = state.finalPlan.steps.map(step => 
      step.step_number === stepNumber ? { ...step, prompt: newPrompt } : step
    );
    
    return { 
      finalPlan: { ...state.finalPlan, steps: newSteps } 
    };
  }),

  setStep: (step) => set({ step }),

  reset: () => {
    // Reset Chat Store as well to ensure a clean slate
    useChatStore.getState().resetChat();
    
    set({
      userRequest: "",
      capabilities: ["Text"],
      selectedTool: null,
      finalPlan: null,
      step: 'INPUT',
      error: null
    });
  },

  // API: SELECT TOOL
  submitSelection: async () => {
    const { userRequest, capabilities, constraints } = get();
    
    if (userRequest.length < 10) {
      set({ error: "Please describe your idea in more detail (at least 10 characters). This helps us find the perfect tool for you." });
      return;
    }

    set({ isLoading: true, step: 'SELECTING', error: null });

    try {
      const payload: SelectionRequest = {
        userRequest,
        constraints,
        required_capabilities: capabilities
      };

      const res = await fetch('/api/architect/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Tool selection failed";
        throw new Error(errorMsg);
      }

      set({ 
        selectedTool: data.tool, // The Full Tool Object
        step: 'CONFIRMATION',
        isLoading: false 
      });

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An unexpected error occurred while selecting tools. Please try again.";
      
      set({ 
        error: errorMessage, 
        step: 'INPUT', // Go back
        isLoading: false 
      });
    }
  },

  // API: GENERATE PLAN
  submitPlan: async () => {
    const { userRequest, selectedTool } = get();
    if (!selectedTool) {
      set({ error: "No tool selected. Please go back and select a tool first." });
      return;
    }

    set({ isLoading: true, step: 'PLANNING', error: null });

    try {
      const res = await fetch('/api/architect/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRequest,
          selectedToolId: selectedTool.id
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        const errorMsg = data.error || "Plan generation failed";
        throw new Error(errorMsg);
      }

      set({ 
        finalPlan: data,
        step: 'RESULT',
        isLoading: false 
      });

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to generate your launch plan. Please try again.";
      
      set({ 
        error: errorMessage, 
        step: 'CONFIRMATION', 
        isLoading: false 
      });
    }
  }
}));