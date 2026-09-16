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
  title: "Chiang Mai AI Center | Business Infrastructure in Thailand",
  description: "Chiang Mai AI Center is a premium business infrastructure platform located on Mahidol Road (Nong Hoi, Mueang Chiang Mai 50000), offering private offices, registered business addresses, enterprise fiber, and landing services for AI startups and global tech teams in Thailand.",
  keywords: [
    "Chiang Mai AI Center",
    "Mahidol Road",
    "Nong Hoi",
    "Mueang Chiang Mai",
    "50000",
    "Office Rental Chiang Mai",
    "Business Address Registration Thailand",
    "Company Registration Chiang Mai",
    "Thailand Tech Hub",
    "Colasola"
  ],
  authors: [{ name: "Chiang Mai AI Center" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Chiang Mai AI Center | Business Infrastructure in Thailand",
    description: "Premium private offices and landing support for AI startups and international tech teams in Chiang Mai (Mahidol Rd, Nong Hoi 50000).",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Chiang Mai AI Center",
  "legalName": "Colasola Co., Ltd.",
  "alternateName": "บริษัท โคล่าโซล่า จำกัด",
  "url": "https://lazzor.com",
  "logo": "https://lazzor.com/images/logo.png",
  "image": "https://lazzor.com/images/image_1.jpg",
  "description": "Chiang Mai AI Center provides premium private offices, business address registration, corporate networking, and soft landing services along Mahidol Road in Nong Hoi, Mueang Chiang Mai 50000.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "236/105 Moo 6, Mahidol Road",
    "addressLocality": "Nong Hoi, Mueang Chiang Mai",
    "addressRegion": "Chiang Mai",
    "postalCode": "50000",
    "addressCountry": "TH"
  },
  "taxID": "0505566006478"
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
