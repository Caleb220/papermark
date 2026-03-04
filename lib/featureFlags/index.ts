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

export const getFeatureFlags = async ({ teamId }: { teamId?: string }) => {
  return {
    tokens: true,
    incomingWebhooks: true,
    roomChangeNotifications: true,
    webhooks: true,
    conversations: true,
    dataroomUpload: true,
    inDocumentLinks: true,
    usStorage: false,
    dataroomIndex: true,
    slack: false,
    annotations: true,
    dataroomInvitations: true,
    workflows: true,
    ai: false,
    sso: false,
    textSelection: true,
  };
};
