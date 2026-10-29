import type { Metadata } from "next";
import WorkspaceClient from "./WorkspaceClient";

export const metadata: Metadata = {
  title: {
    absolute: "Office for Rent Chiang Mai | Private Office Suites & Floor Plans · เช่าออฟฟิศ เชียงใหม่",
  },
  description:
    "Rent private furnished office suites in Chiang Mai along Mahidol Road (Nong Hoi). 5 floors, 40+ units from ฿1,500 to ฿11,200/mo (1-8 pax). 1 Gbps redundant fiber, free parking, DBD registered business address, 5 min from airport. ออฟฟิศให้เช่า เชียงใหม่ พร้อมที่จอดรถและเน็ตไฟเบอร์.",
  alternates: {
    canonical: "/workspace",
    languages: {
      "en-US": "/workspace",
      "th-TH": "/workspace",
    },
  },
  openGraph: {
    title: "Office for Rent Chiang Mai | Private Office Suites & Floor Plans · เช่าออฟฟิศ เชียงใหม่",
    description:
      "Modern 5-floor office building on Mahidol Rd, Chiang Mai. Private office suites for 1-8 pax (from ฿1,500/mo), 1 Gbps fiber, free parking, DBD registered address. ออฟฟิศให้เช่า เชียงใหม่.",
    url: "/workspace",
    siteName: "Chiang Mai AI Center · เช่าออฟฟิศ เชียงใหม่",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai AI Center — Office for Rent in Chiang Mai",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Office for Rent Chiang Mai | Private Office Suites & Floor Plans · เช่าออฟฟิศ เชียงใหม่",
    description:
      "Explore 5-floor office suites, floor plans, and amenities at Chiang Mai AI Center (Mahidol Rd). Units from ฿1,500/mo with free parking. ออฟฟิศให้เช่า เชียงใหม่.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <WorkspaceClient />;
}
