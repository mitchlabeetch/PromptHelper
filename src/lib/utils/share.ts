import { LaunchPlan } from "@/types";

export const generateShareLink = (plan: LaunchPlan): string => {
  const data = JSON.stringify(plan);
  const encoded = btoa(data);
  const url = `${window.location.origin}/share?data=${encoded}`;
  return url;
};
