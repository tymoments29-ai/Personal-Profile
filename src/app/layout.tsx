import type { Metadata } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // Cache pages for 1 hour to fix high TTFB

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})
import { Toaster } from '@/components/ui/sonner'

const BASE_URL = 'https://sukristiyo.my.id'

export async function generateMetadata(): Promise<Metadata> {
  // Use the new clean API route for the OG image
  // This avoids WhatsApp crawler bugs with %20 spaces in Vercel Blob URLs
  const ogImageUrl = `${BASE_URL}/api/og`

  const ogImages = [
    { url: ogImageUrl, width: 400, height: 400, alt: 'Sukristiyo — DevOps, SRE & Cloud Engineer' }
  ]

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'Sukristiyo — DevOps, SRE & Cloud Engineer',
      template: '%s | Sukristiyo',
    },
    icons: {
      icon: ogImageUrl,
      apple: ogImageUrl,
    },
    description:
      'Personal portfolio of Sukristiyo — IT professional specializing in DevOps, Site Reliability Engineering, Cloud Infrastructure, and Data Center management based in Jakarta, Indonesia.',
    keywords: [
      'Sukristiyo',
      'DevOps Engineer',
      'SRE',
      'Cloud Engineer',
      'Data Center',
      'AWS',
      'Nutanix',
      'VMware',
      'Jakarta',
      'Indonesia',
    ],
    authors: [{ name: 'Sukristiyo', url: BASE_URL }],
    creator: 'Sukristiyo',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      alternateLocale: 'id_ID',
      url: BASE_URL,
      siteName: 'Sukristiyo Portfolio',
      title: 'Sukristiyo — DevOps, SRE & Cloud Engineer',
      description:
        'Personal portfolio of Sukristiyo — IT professional specializing in DevOps, SRE, Cloud Infrastructure, and Data Center management.',
      images: ogImages,
    },
    twitter: {
      card: 'summary',
      title: 'Sukristiyo — DevOps, SRE & Cloud Engineer',
      description: 'IT professional specializing in DevOps, SRE, Cloud Infrastructure, and Data Center management.',
      images: ogImages.map((img) => img.url),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import NextTopLoader from 'nextjs-toploader'

import { ThemeProvider } from '@/components/layout/ThemeProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <NextTopLoader color="var(--gold)" showSpinner={false} />
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster
            richColors
            position="bottom-right"
          />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sukristiyo",
              "url": "https://sukristiyo.my.id",
              "jobTitle": "DevOps, SRE & Cloud Engineer",
              "sameAs": [
                "https://github.com/sukristiyo",
                "https://www.linkedin.com/in/sukristiyo/"
              ]
            })
          }}
        />
      </body>
    </html>
  )
}
