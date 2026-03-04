import { get } from "@vercel/edge-config";

export type BetaFeatures =
  | "tokens"
  | "incomingWebhooks"
  | "roomChangeNotifications"
  | "webhooks"
  | "conversations"
  | "dataroomUpload"
  | "inDocumentLinks"
  | "usStorage"
  | "dataroomIndex"
  | "slack"
  | "annotations"
  | "dataroomInvitations"
  | "workflows"
  | "ai"
  | "sso"
  | "textSelection";

type BetaFeaturesRecord = Record<BetaFeatures, string[]>;

export const getFeatureFlags = async ({ teamId }: { teamId?: string }) => {
  const teamFeatures: Record<BetaFeatures, boolean> = {
    tokens: true,
    incomingWebhooks: true,
    roomChangeNotifications: true,
    webhooks: true,
    conversations: true,
    dataroomUpload: true,
    inDocumentLinks: true,
    usStorage: true,
    dataroomIndex: true,
    slack: false,
    annotations: true,
    dataroomInvitations: true,
    workflows: true,
    ai: true,
    sso: false,
    textSelection: true,
  };


  return teamFeatures;
};
