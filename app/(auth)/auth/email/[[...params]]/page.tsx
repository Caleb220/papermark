import { Metadata } from "next";

import EmailVerificationClient from "./page-client";

const data = {
  description: "Verify your login to Odinkor",
  title: "Verify Login | Odinkor",
  url: "/auth/email",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.odinkor.com"),
  title: data.title,
  description: data.description,
  openGraph: {
    title: data.title,
    description: data.description,
    url: data.url,
    siteName: "Odinkor",
    images: [
      {
        url: "/_static/meta-image.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: data.title,
    description: data.description,
    creator: "@odinkor",
    images: ["/_static/meta-image.png"],
  },
};

export default async function EmailVerificationPage() {
  return <EmailVerificationClient />;
}
