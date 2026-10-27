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
    default: "Chiang Mai AI Center | Digital Innovation & Enterprise Hub",
    template: "%s | Chiang Mai AI Center",
  },
  description:
    "Chiang Mai AI Center is a 100% Thai-owned enterprise innovation hub located within 3 km of Chiang Mai city center on Mahidol Road. Offering private offices, registered business addresses, enterprise cloud workstations, clean IP networking, and Thailand soft landing services.",
  alternates: {
    canonical: "/",
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
    siteName: "Chiang Mai AI Center",
    title: "Chiang Mai AI Center | Digital Innovation & Enterprise Hub",
    description:
      "100% Thai-owned enterprise hub in Chiang Mai (Mahidol Rd). Private offices, AI cloud workstations, business address, and company landing support.",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai AI Center Campus & Innovation Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiang Mai AI Center | Digital Innovation & Enterprise Hub",
    description:
      "Chiang Mai AI Center — Private offices, AI cloud workstations & business landing in Chiang Mai, Thailand.",
    images: ["/images/og-cover.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://lazzor.com/#localbusiness",
      "name": "Chiang Mai AI Center",
      "legalName": "Colasola Co., Ltd.",
      "alternateName": "บริษัท โคล่าโซล่า จำกัด",
      "url": "https://lazzor.com",
      "logo": "https://lazzor.com/images/logo.png",
      "image": "https://lazzor.com/images/og-cover.jpg",
      "description":
        "Chiang Mai AI Center is a 100% Thai-owned digital innovation hub located within 3 km of Chiang Mai city center on Mahidol Road, offering private offices, business address registration, AI enterprise cloud workstations, and Thailand soft landing services.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "236/105 Moo 6, Mahidol Road",
        "addressLocality": "Nong Hoi, Mueang Chiang Mai",
        "addressRegion": "Chiang Mai",
        "postalCode": "50000",
        "addressCountry": "TH"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 18.7656,
        "longitude": 99.0062
      },
      "hasMap": "https://maps.google.com/?q=18.7656,99.0062",
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
      "sameAs": [
        "https://cloud.lazzor.com",
        "https://ai.lazzor.com",
        "https://colasola.com"
      ],
      "priceRange": "฿฿",
      "taxID": "0505566006478"
    },
    {
      "@type": "FAQPage",
      "@id": "https://lazzor.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can foreigners rent an office?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, absolutely. We specialize in helping international founders and companies set up operations in Chiang Mai, providing full contract support in English."
          }
        },
        {
          "@type": "Question",
          "name": "Can I register my company here?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. We offer premium registered business address services along with partner-based company registration, accounting, and tax filing setup."
          }
        },
        {
          "@type": "Question",
          "name": "Is mail handling available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, our reception team handles all business letters and parcels, and provides instant digital notifications (via email or chat) upon receipt."
          }
        },
        {
          "@type": "Question",
          "name": "Is short-term rental available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "We focus on stable business operations. The standard leasing term starts from 6 to 12 months to foster a solid corporate environment."
          }
        },
        {
          "@type": "Question",
          "name": "Is parking available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, secure dedicated car and motorcycle parking spaces are available for office tenants and their guests."
          }
        },
        {
          "@type": "Question",
          "name": "How do I schedule a visit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "You can easily book a physical or virtual tour using our online visit booking form below, or contact us directly via LINE, WeChat, or WhatsApp."
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
