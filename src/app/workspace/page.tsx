import type { Metadata } from "next";
import WorkspaceClient from "./WorkspaceClient";

export const metadata: Metadata = {
  title: "Private Office Rental & Floor Plans",
  description:
    "Explore private office suites, dedicated desks, and 5-floor building specifications at Chiang Mai AI Center. Located within 3 km of Chiang Mai city center on Mahidol Road with 1 Gbps redundant fiber.",
  alternates: {
    canonical: "/workspace",
  },
  openGraph: {
    title: "Private Office Rental & Floor Plans | Chiang Mai AI Center",
    description:
      "5-floor modern tech building in Chiang Mai. Private office suites, high-speed fiber, meeting rooms, and registered office addresses.",
    url: "/workspace",
    siteName: "Chiang Mai AI Center",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai AI Center Workspace & Floor Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Office Rental & Floor Plans | Chiang Mai AI Center",
    description:
      "Explore 5-floor office suites, floor plans, and amenities at Chiang Mai AI Center.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <WorkspaceClient />;
}
