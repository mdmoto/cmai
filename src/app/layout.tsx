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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window._jsErrors = [];
              window.onerror = function(msg, url, line, col, error) {
                var errStr = 'Err: ' + msg + ' (' + url + ':' + line + ':' + col + ')';
                window._jsErrors.push(errStr);
                var div = document.getElementById('debug-error-log');
                if (div) {
                  div.style.display = 'block';
                  var li = document.createElement('li');
                  li.textContent = errStr;
                  div.querySelector('ul').appendChild(li);
                }
              };
              window.onunhandledrejection = function(event) {
                var errStr = 'Unhandled rejection: ' + (event.reason ? (event.reason.message || event.reason) : 'Unknown');
                window._jsErrors.push(errStr);
                var div = document.getElementById('debug-error-log');
                if (div) {
                  div.style.display = 'block';
                  var li = document.createElement('li');
                  li.textContent = errStr;
                  div.querySelector('ul').appendChild(li);
                }
              };
              // Diagnostic fetch of the chunk file
              fetch('/_next/static/chunks/17c2xufnf7-1b.js')
                .then(function(res) {
                  return res.text();
                })
                .then(function(text) {
                  var div = document.getElementById('debug-error-log');
                  if (div) {
                    div.style.display = 'block';
                    var li = document.createElement('li');
                    li.textContent = 'Diagnostic Fetch Preview (first 120 chars): ' + text.slice(0, 120);
                    div.querySelector('ul').appendChild(li);
                  }
                })
                .catch(function(err) {
                  var div = document.getElementById('debug-error-log');
                  if (div) {
                    div.style.display = 'block';
                    var li = document.createElement('li');
                    li.textContent = 'Diagnostic Fetch Error: ' + err.message;
                    div.querySelector('ul').appendChild(li);
                  }
                });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <LanguageProvider>{children}</LanguageProvider>
        
        {/* Absolute debugging element to display JavaScript errors on client devices */}
        <div
          id="debug-error-log"
          style={{
            display: "none",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            backgroundColor: "#dc2626",
            color: "#ffffff",
            padding: "16px",
            fontFamily: "monospace",
            fontSize: "12px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              borderBottom: "1px solid #ef4444",
              paddingBottom: "4px",
              marginBottom: "8px",
            }}
          >
            ⚠️ [DEBUG LOG] Client JS Exception:
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px", listStyleType: "disc" }}></ul>
        </div>
      </body>
    </html>
  );
}
