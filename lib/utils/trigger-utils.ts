import { BasePlan } from "../swr/use-billing";

export const conversionQueue = (plan: string): string => {
  const planName = plan.split("+")[0] as BasePlan;
  return `conversion-${planName}`;
};
