import type { Metadata } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { prisma } from '@/lib/prisma'

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
  // Fetch profile photo from DB to use as OG image
  let profilePhotoUrl: string | null = null
  try {
    const settings = await prisma.siteSettings.findFirst()
    profilePhotoUrl = settings?.profilePhotoUrl ?? null
  } catch {
    // fallback: no image
  }

  const ogImages = profilePhotoUrl
    ? [{ url: profilePhotoUrl, width: 400, height: 400, alt: 'Sukristiyo — DevOps, SRE & Cloud Engineer' }]
    : []

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'Sukristiyo — DevOps, SRE & Cloud Engineer',
      template: '%s | Sukristiyo',
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
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster
            richColors
            position="bottom-right"
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
