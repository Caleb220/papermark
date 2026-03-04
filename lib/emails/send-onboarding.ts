import { CreateUserEmailProps } from "../types";

type EmailType =
  | "onboarding1"
  | "onboarding2"
  | "onboarding3"
  | "onboarding4"
  | "onboarding5";

export const sendOnboardingEmail = async (
  params: CreateUserEmailProps,
  emailType: EmailType,
) => {
  // Stubbed out – onboarding/marketing email removed
  return;
};
