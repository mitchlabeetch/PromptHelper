import jsPDF from 'jspdf';
import { LaunchPlan } from '@/types';

// Export as Markdown
export const generateMarkdown = (plan: LaunchPlan, userRequest: string): string => {
  let md = `# Project Launch Plan\n\n`;
  md += `**Goal:** ${userRequest}\n`;
  md += `**Tool Stack:** ${plan.tool_stack.map(t => t.tool_name).join(", ")}\n\n`;

  md += `## Executive Summary\n${plan.plan_description}\n\n`;

  md += `## Execution Steps\n`;
  plan.steps.forEach((step) => {
    md += `### Step ${step.step_number}: ${step.title}\n`;
    md += `${step.instruction}\n\n`;
    if (step.prompt) {
      md += `**Prompt:**\n\`\`\`\n${step.prompt}\n\`\`\`\n\n`;
    }
  });

  return md;
};

// Export as PDF
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generatePDF = (plan: LaunchPlan, userRequest: string) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.text("Project Launch Plan", 20, 20);

  // Metadata
  doc.setFontSize(12);
  doc.text(`Tools: ${plan.tool_stack.map(t => t.tool_name).join(", ")}`, 20, 35);

  // Summary
  doc.setFontSize(14);
  doc.text("Executive Summary", 20, 55);
  doc.setFontSize(10);

  const splitSummary = doc.splitTextToSize(plan.plan_description, 170);
  doc.text(splitSummary, 20, 65);

  let yPos = 65 + (splitSummary.length * 5) + 10;

  // Steps
  doc.setFontSize(14);
  doc.text("Execution Steps", 20, yPos);
  yPos += 10;

  plan.steps.forEach((step) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Step ${step.step_number}: ${step.title}`, 20, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const explanation = doc.splitTextToSize(step.instruction, 170);
    doc.text(explanation, 20, yPos);
    yPos += (explanation.length * 5) + 5;

    if (step.prompt) {
       if (yPos > 250) {
         doc.addPage();
         yPos = 20;
       }
       doc.setFillColor(240, 240, 240);
       doc.rect(20, yPos, 170, 30, 'F');
       doc.setFont("courier", "normal");
       const prompt = doc.splitTextToSize(step.prompt, 160);
       doc.text(prompt, 25, yPos + 10);
       yPos += 40;
    }

    yPos += 10;
  });

  doc.save("launch-plan.pdf");
};
