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
  description: "Chiang Mai AI Center is a premium business infrastructure platform offering high-quality private offices, enterprise networking, and landing services for AI startups and global tech teams in Thailand.",
  keywords: ["Chiang Mai", "AI Center", "Office Rental", "Business Address", "Company Registration", "Thailand Startup", "Tech Workspace"],
  authors: [{ name: "Chiang Mai AI Center" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Chiang Mai AI Center | Business Infrastructure in Thailand",
    description: "Premium private offices and landing support for AI startups and international tech teams in Chiang Mai.",
    type: "website",
  },
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
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
