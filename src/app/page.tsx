import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: {
    absolute: "Chiang Mai AI Center | Office for Rent & Enterprise Hub · เช่าออฟฟิศ เชียงใหม่",
  },
  description:
    "Chiang Mai AI Center offers private furnished offices for rent, DBD registered business address certification, 1 Gbps redundant fiber, and soft landing support on Mahidol Road, Chiang Mai. 40+ private suites from ฿1,500/mo with free parking. ออฟฟิศให้เช่า เชียงใหม่ พร้อมที่จอดรถ.",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "th-TH": "/",
    },
  },
  openGraph: {
    title: "Office for Rent Chiang Mai | Private Office Suites & Enterprise Hub · เช่าออฟฟิศ เชียงใหม่",
    description:
      "Private furnished offices for rent in Chiang Mai (Mahidol Rd). 40+ suites from ฿1,500/mo, 1 Gbps fiber, free parking, DBD registered business address. ออฟฟิศให้เช่า เชียงใหม่.",
    url: "/",
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
    title: "Office for Rent Chiang Mai | Private Office Suites & Enterprise Hub · เช่าออฟฟิศ เชียงใหม่",
    description:
      "Private furnished offices for rent on Mahidol Rd, Chiang Mai. 1-8 pax, 1 Gbps fiber, free parking, DBD company registration address. ออฟฟิศให้เช่า เชียงใหม่.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function Page() {
  return <HomeClient />;
}
