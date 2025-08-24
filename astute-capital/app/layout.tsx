import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SiteFooter from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Astute Capital - AI-Powered Trading Platform",
  description:
    "Professional trading platform with AI-powered signals, advanced analytics, and institutional-grade market intelligence",
  keywords: "trading, AI signals, market analysis, portfolio management, financial technology",
  authors: [{ name: "Astute Capital" }],
  creator: "Astute Capital",
  publisher: "Astute Capital",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#10b981",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://astutecapital.com",
    title: "Astute Capital - AI-Powered Trading Platform",
    description: "Professional trading platform with AI-powered signals and advanced market analytics",
    siteName: "Astute Capital",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astute Capital - AI-Powered Trading Platform",
    description: "Professional trading platform with AI-powered signals and advanced market analytics",
    creator: "@astutecapital",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
