import type { Metadata } from "next";
import VpnClient from "./VpnClient";

export const metadata: Metadata = {
  title: "Corporate Network Portal & Secure Access",
  description:
    "Secure corporate network portal, Cisco AnyConnect & VLESS configuration instructions for Chiang Mai AI Center members and global remote developers.",
  alternates: {
    canonical: "/vpn",
  },
  openGraph: {
    title: "Corporate Network Portal & Secure Access | Chiang Mai AI Center",
    description:
      "Secure corporate network access, AnyConnect and VLESS endpoints for Chiang Mai AI Center members.",
    url: "/vpn",
    siteName: "Chiang Mai AI Center",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai AI Center Corporate Network Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Network Portal & Secure Access | Chiang Mai AI Center",
    description:
      "Secure corporate network access and configuration guide for Chiang Mai AI Center.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <VpnClient />;
}
