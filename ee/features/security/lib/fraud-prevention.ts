import { stripeInstance } from "@/ee/stripe";
import { Stripe } from "stripe";

import { log } from "@/lib/utils";

/**
 * High-risk decline codes that indicate potential fraud
 */
const FRAUD_DECLINE_CODES = [
  "fraudulent",
  "stolen_card",
  "pickup_card",
  "restricted_card",
  "security_violation",
];

/**
 * Add email to Stripe Radar value list for blocking
 */
export async function addEmailToStripeRadar(email: string): Promise<boolean> {
  try {
    const stripeClient = stripeInstance();
    await stripeClient.radar.valueListItems.create({
      value_list: process.env.STRIPE_LIST_ID!,
      value: email,
    });

    log({
      message: `Added email ${email} to Stripe Radar blocklist`,
      type: "info",
    });
    return true;
  } catch (error) {
    log({
      message: `Failed to add email ${email} to Stripe Radar: ${error}`,
      type: "error",
    });
    return false;
  }
}

/**
 * No-op: Edge Config blocklist is no longer used.
 */
export async function addEmailToEdgeConfig(email: string): Promise<boolean> {
  return true;
}

/**
 * Process Stripe payment failure for fraud indicators
 */
export async function processPaymentFailure(
  event: Stripe.Event,
): Promise<void> {
  const paymentFailure = event.data.object as Stripe.PaymentIntent;
  const email = paymentFailure.receipt_email;
  const declineCode = paymentFailure.last_payment_error?.decline_code;

  if (!email || !declineCode) {
    return;
  }

  // Check if decline code indicates fraud
  if (FRAUD_DECLINE_CODES.includes(declineCode)) {
    log({
      message: `Fraud indicator detected: ${declineCode} for email: ${email}`,
      type: "info",
    });

    // Add to Stripe Radar
    const stripeResult = await addEmailToStripeRadar(email);

    if (stripeResult) {
      log({
        message: `Successfully added ${email} to Stripe Radar`,
        type: "info",
      });
    } else {
      log({
        message: `Failed to add ${email} to Stripe Radar`,
        type: "error",
      });
    }
  }
}
