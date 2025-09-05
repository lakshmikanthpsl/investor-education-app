import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/contexts/language-context"
import { OfflineIndicator } from "@/components/offline-indicator"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nivesh Sikho - Investment Learning App",
  description: "Learn stock market investing with interactive tutorials and virtual trading in your language",
  generator: "v0.app",
  manifest: "/manifest.json",
  keywords: ["investment", "education", "stock market", "trading", "finance", "india"],
  authors: [{ name: "Nivesh Sikho Team" }],
  creator: "Nivesh Sikho",
  publisher: "Nivesh Sikho",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon-192.png",
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nivesh Sikho",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} pb-16 sm:pb-0`}>
        <Suspense fallback={<div>Loading...</div>}>
          <LanguageProvider>
            {children}
            <OfflineIndicator />
            <MobileNavigation />
          </LanguageProvider>
        </Suspense>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
