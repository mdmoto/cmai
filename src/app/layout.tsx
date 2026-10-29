import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lazzor.com"),
  title: {
    default: "Chiang Mai AI Center | Office for Rent & Private Workspaces · เช่าออฟฟิศ เชียงใหม่",
    template: "%s | Chiang Mai AI Center · เช่าออฟฟิศ เชียงใหม่",
  },
  description:
    "Private office suites for rent in Chiang Mai on Mahidol Road (Nong Hoi). 5-floor commercial building, 40+ private furnished offices (1-8 pax) from ฿1,500/mo, 1 Gbps redundant fiber, free parking, DBD registered business address, 5 min from airport. ออฟฟิศให้เช่า เชียงใหม่ พร้อมจดทะเบียนบริษัท.",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "th-TH": "/",
    },
  },
  authors: [{ name: "Chiang Mai AI Center", url: "https://lazzor.com" }],
  creator: "Colasola Co., Ltd.",
  publisher: "Chiang Mai AI Center",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lazzor.com",
    siteName: "Chiang Mai AI Center · เช่าออฟฟิศ เชียงใหม่",
    title: "Chiang Mai AI Center | Office for Rent & Private Workspaces · เช่าออฟฟิศ เชียงใหม่",
    description:
      "Private office suites for rent in Chiang Mai (Mahidol Rd). 5 floors, 40+ furnished suites (1-8 pax) from ฿1,500/mo, 1 Gbps fiber, free parking & DBD address.",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai AI Center — Office for Rent in Chiang Mai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiang Mai AI Center | Office for Rent & Private Workspaces · เช่าออฟฟิศ เชียงใหม่",
    description:
      "Private office suites for rent in Chiang Mai (Mahidol Rd). 1-8 pax, 1 Gbps fiber, free parking, DBD company registration address. ออฟฟิศให้เช่า เชียงใหม่.",
    images: ["/images/og-cover.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "RealEstateAgent"],
      "@id": "https://lazzor.com/#localbusiness",
      "additionalType": "https://schema.org/CommercialBuilding",
      "name": "Chiang Mai AI Center — Office for Rent & Private Workspaces",
      "legalName": "Colasola Co., Ltd.",
      "alternateName": [
        "บริษัท โคล่าโซล่า จำกัด",
        "เช่าออฟฟิศ เชียงใหม่ - Chiang Mai AI Center",
        "Chiang Mai AI Center Office Rental",
        "ศูนย์ AI เชียงใหม่ ออฟฟิศให้เช่า",
        "Chiang Mai Office for Rent",
        "清迈AI中心办公室租赁"
      ],
      "url": "https://lazzor.com",
      "logo": "https://lazzor.com/images/logo.png",
      "image": "https://lazzor.com/images/og-cover.jpg",
      "description":
        "Chiang Mai AI Center provides private furnished office suites for rent, registered business address certification (DBD), 1 Gbps redundant fiber internet, meeting rooms, and free parking on Mahidol Road in Chiang Mai. บริการเช่าออฟฟิศ เชียงใหม่ พร้อมที่จอดรถและที่อยู่จดทะเบียนบริษัท.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "236/105 หมู่ 6 ถนนมหิดล ตำบลหนองหอย / 236/105 Moo 6, Mahidol Road",
        "addressLocality": "เมืองเชียงใหม่ / Nong Hoi, Mueang Chiang Mai",
        "addressRegion": "เชียงใหม่ / Chiang Mai",
        "postalCode": "50000",
        "addressCountry": "TH"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 18.7656,
        "longitude": 99.0062
      },
      "hasMap": "https://maps.google.com/?q=18.7656,99.0062",
      "areaServed": [
        "Chiang Mai",
        "Mueang Chiang Mai",
        "Nong Hoi",
        "Mahidol Road",
        "เชียงใหม่",
        "อำเภอเมืองเชียงใหม่",
        "ตำบลหนองหอย",
        "ถนนมหิดล"
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "High-Speed Redundant Fiber Internet (1 Gbps)",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Dedicated Free Car & Motorcycle Parking (ที่จอดรถยนต์และมอเตอร์ไซค์ฟรี)",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "DBD Registered Business Address (ที่อยู่จดทะเบียนพาณิชย์/บริษัท DBD)",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Independent Air Conditioning (เครื่องปรับอากาศแยกส่วน)",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Professional 8-10 Pax Conference Room (ห้องประชุมพร้อมจอสมาร์ท)",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "24/7 Smart Keycard Security & CCTV (ระบบรักษาความปลอดภัย 24 ชม.)",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Reception Mail & Parcel Handling (บริการรับพัสดุและจดหมายธุรกิจ)",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Pantry Kitchen with Coffee & Water (ห้องครัวและมุมพักผ่อน)",
          "value": true
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Chiang Mai Office Rental Catalog · รายการพื้นที่เช่าสำนักงานเชียงใหม่",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Small Private Office (1-2 Pax) · ออฟฟิศส่วนตัวขนาดเล็ก",
            "description": "10-12 sqm private furnished office suite with natural window or AC, 1 Gbps fiber internet, and free parking.",
            "price": "1500",
            "priceCurrency": "THB",
            "unitCode": "MON",
            "availability": "https://schema.org/InStock",
            "url": "https://lazzor.com/workspace"
          },
          {
            "@type": "Offer",
            "name": "Medium Team Suite (2-4 Pax) · ออฟฟิศส่วนตัวขนาดกลาง",
            "description": "18-29 sqm team office suite equipped with desks, AC, and high-speed networking.",
            "price": "4700",
            "priceCurrency": "THB",
            "unitCode": "MON",
            "availability": "https://schema.org/InStock",
            "url": "https://lazzor.com/workspace"
          },
          {
            "@type": "Offer",
            "name": "Executive Team Suite (4-8 Pax) · ออฟฟิศขนาดใหญ่สำหรับทีมบริหาร",
            "description": "24-57 sqm spacious executive office with panoramic windows, independent AC, and private server rack options.",
            "price": "5400",
            "priceCurrency": "THB",
            "unitCode": "MON",
            "availability": "https://schema.org/InStock",
            "url": "https://lazzor.com/workspace"
          },
          {
            "@type": "Offer",
            "name": "DBD Registered Business Address · ที่อยู่จดทะเบียนบริษัท DBD เชียงใหม่",
            "description": "Official commercial physical address authorization with lease agreement for Thai Department of Business Development (DBD) and VAT registration.",
            "price": "1000",
            "priceCurrency": "THB",
            "unitCode": "MON",
            "availability": "https://schema.org/InStock",
            "url": "https://lazzor.com/workspace"
          }
        ]
      },
      "priceRange": "฿1,500 - ฿22,600 / month",
      "currenciesAccepted": "THB",
      "paymentAccepted": "Bank Transfer, PromptPay, Credit Card, Cash",
      "sameAs": [
        "https://cloud.lazzor.com",
        "https://ai.lazzor.com",
        "https://colasola.com"
      ],
      "taxID": "0505566006478"
    },
    {
      "@type": "FAQPage",
      "@id": "https://lazzor.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can foreigners rent an office in Chiang Mai? / ชาวต่างชาติสามารถเช่าออฟฟิศในเชียงใหม่ได้หรือไม่?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, absolutely. We specialize in helping international founders, digital teams, and foreign companies lease offices in Chiang Mai, providing bilingual English-Thai contracts and full legal landing support. / ได้อย่างแน่นอน เราเชี่ยวชาญในการช่วยเหลือผู้ก่อตั้งและบริษัทต่างชาติในการเช่าออฟฟิศในเชียงใหม่ พร้อมสัญญาเช่าภาษาอังกฤษและไทยที่ถูกต้องตามกฎหมาย"
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this address to register a Thai company (DBD) and VAT? / สามารถใช้ที่อยู่นี้จดทะเบียนบริษัท DBD และภาษีมูลค่าเพิ่มได้หรือไม่?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. We provide official commercial registered business address certification with complete landlord documentation required by the Department of Business Development (DBD) and Revenue Department for company incorporation and VAT registration. / ได้ เรามีหนังสือยินยอมและสัญญาเช่าสถานที่เชิงพาณิชย์สำหรับใช้จดทะเบียนบริษัทกับกรมพัฒนาธุรกิจการค้า (DBD) และภาษีมูลค่าเพิ่ม (VAT)"
          }
        },
        {
          "@type": "Question",
          "name": "What is the price range and what utilities are included in the office rent? / อัตราค่าเช่าออฟฟิศเริ่มต้นเท่าไหร่และรวมค่าบริการอะไรบ้าง?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Private office suites range from ฿1,500/month for compact 1-2 person units up to ฿11,200/month for large executive suites (1-8 pax). Rent includes 1 Gbps redundant fiber internet, reception parcel handling, water, free dedicated car & motorcycle parking, meeting room quota, and 24/7 security. / ค่าเช่าออฟฟิศส่วนตัวเริ่มต้นที่ 1,500 บาท/เดือน ถึง 11,200 บาท/เดือน รวมอินเทอร์เน็ตไฟเบอร์ 1 Gbps, ที่จอดรถยนต์/มอเตอร์ไซค์ฟรี, ค่าน้ำ, บริการรับพัสดุ และระบบรักษาความปลอดภัย 24 ชม."
          }
        },
        {
          "@type": "Question",
          "name": "Where is the building located and how accessible is it? / อาคารตั้งอยู่ที่ไหน เดินทางสะดวกจากสนามบินเชียงใหม่และตัวเมืองหรือไม่?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Chiang Mai AI Center is located at 236/105 Moo 6, Mahidol Road, Nong Hoi, Mueang Chiang Mai 50000. It is located on main Mahidol Road within 3 km of Chiang Mai city center, just 5 minutes (3.5 km) from Chiang Mai International Airport and Central Chiangmai Airport mall. / อาคารตั้งอยู่เลขที่ 236/105 หมู่ 6 ถนนมหิดล ตำบลหนองหอย อำเภอเมืองเชียงใหม่ 50000 ริมถนนใหญ่มหิดล ห่างจากสนามบินเชียงใหม่และเซ็นทรัลแอร์พอร์ตเพียง 5 นาที (3.5 กม.)"
          }
        },
        {
          "@type": "Question",
          "name": "Is mail and parcel handling available? / มีบริการจัดการจดหมายและพัสดุหรือไม่?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, our on-site reception team receives all business letters and courier parcels, providing instant digital notifications via chat or email. / มี ทีมต้อนรับของเราจัดการรับจดหมายและพัสดุธุรกิจทั้งหมด พร้อมแจ้งเตือนทางดิจิทัลทันที"
          }
        },
        {
          "@type": "Question",
          "name": "Is short-term rental available and what is the minimum lease? / มีบริการเช่าระยะสั้นหรือไม่ และสัญญาขั้นต่ำกี่เดือน?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Standard lease terms start from 6 to 12 months with a 2-month refundable security deposit to ensure a stable, productive enterprise business environment. / ระยะเวลาเช่ามาตรฐานเริ่มต้นที่ 6 ถึง 12 เดือน พร้อมเงินประกันความเสียหายที่คืนเงินได้ 2 เดือน"
          }
        },
        {
          "@type": "Question",
          "name": "Is dedicated parking available? / มีที่จอดรถให้บริการหรือไม่?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, secure dedicated car and motorcycle parking spaces are provided free of charge for office tenants and visiting clients. / มี ที่จอดรถยนต์และรถจักรยานยนต์เฉพาะสำหรับผู้เช่าออฟฟิศและแขกผู้มาเยือนฟรี"
          }
        },
        {
          "@type": "Question",
          "name": "How do I schedule a physical or virtual office visit? / นัดหมายเข้าชมสถานที่จริงหรือชมผ่านวิดีโอได้อย่างไร?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "You can book an in-person or video tour using our online visit form, or message us directly on WhatsApp, LINE (@colasola), or WeChat. / สามารถนัดชมสถานที่จริงหรือชมผ่านวิดีโอคอลได้ง่ายๆ ผ่านแบบฟอร์มบนเว็บไซต์ หรือติดต่อเราทาง LINE, WhatsApp หรือ WeChat"
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="dns-prefetch" href="https://ai.lazzor.com" />
        <link rel="preconnect" href="https://ai.lazzor.com" crossOrigin="anonymous" />
        <link rel="prefetch" href="https://ai.lazzor.com" as="document" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
