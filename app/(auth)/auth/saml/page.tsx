import { Metadata } from "next";

import SAMLCallbackClient from "./page-client";

export const metadata: Metadata = {
  title: "SSO Login | Odinkor",
  description: "Completing SSO login",
};

export default function SAMLCallbackPage() {
  return <SAMLCallbackClient />;
}
