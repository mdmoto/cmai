import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Chiang Mai AI Center | Digital Innovation & Enterprise Hub",
  description:
    "Chiang Mai AI Center is a 100% Thai-owned enterprise innovation hub located within 3 km of Chiang Mai city center. Offering private offices, registered business addresses, enterprise cloud workstations, clean IP networking, and Thailand soft landing services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Chiang Mai AI Center | Digital Innovation & Enterprise Hub",
    description:
      "100% Thai-owned enterprise hub in Chiang Mai (Mahidol Rd). Private offices, AI cloud workstations, business address, and company landing support.",
    url: "/",
    siteName: "Chiang Mai AI Center",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai AI Center Campus & Innovation Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiang Mai AI Center | Digital Innovation & Enterprise Hub",
    description:
      "Chiang Mai AI Center — Private offices, AI cloud workstations & business landing in Chiang Mai, Thailand.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <HomeClient />;
}
