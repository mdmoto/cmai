import type { Metadata } from "next";
import ContractClient from "./ContractClient";

export const metadata: Metadata = {
  title: "Online Lease Agreement & Digital Signing",
  description:
    "Official bilingual Thai-English lease agreement, electronic signature verification, and tenancy terms for Chiang Mai AI Center office tenants and registered members.",
  alternates: {
    canonical: "/contract",
  },
  openGraph: {
    title: "Online Lease Agreement & Digital Signing | Chiang Mai AI Center",
    description:
      "Official bilingual lease agreement for Chiang Mai AI Center office tenants.",
    url: "/contract",
    siteName: "Chiang Mai AI Center",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai AI Center Lease Agreement",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Lease Agreement & Digital Signing | Chiang Mai AI Center",
    description:
      "Digital signing portal for Chiang Mai AI Center commercial office leases.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <ContractClient />;
}
