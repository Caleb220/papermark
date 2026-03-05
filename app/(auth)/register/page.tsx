import { Metadata } from "next";

import RegisterClient from "./page-client";

const data = {
  description: "Signup to Odinkor",
  title: "Sign up | Odinkor",
  url: "/register",
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

export default function RegisterPage() {
  return <RegisterClient />;
}
