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
    { url: ogImageUrl, width: 400, height: 400, alt: 'Portfolio OG Image' }
  ]

  let settings;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch (error) {
    console.error("Failed to fetch settings for metadata:", error);
  }

  const name = settings?.nameEn || 'Sukristiyo';
  const subtitle = settings?.subtitleEn || 'DevOps, SRE & Cloud Engineer';
  const fullTitle = `${name} — ${subtitle}`;
  const description = settings?.aboutTextEn 
    ? (settings.aboutTextEn.length > 150 ? settings.aboutTextEn.substring(0, 150) + '...' : settings.aboutTextEn)
    : `Personal portfolio of ${name} — IT professional specializing in DevOps, Site Reliability Engineering, Cloud Infrastructure, and Data Center management.`;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: fullTitle,
      template: `%s | ${name}`,
    },
    icons: {
      icon: settings?.profilePhotoUrl || ogImageUrl,
      apple: settings?.profilePhotoUrl || ogImageUrl,
    },
    description: description,
    keywords: [
      name,
      'DevOps Engineer',
      'SRE',
      'Cloud Engineer',
      'Data Center',
      'Portfolio',
    ],
    authors: [{ name: name, url: BASE_URL }],
    creator: name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      alternateLocale: 'id_ID',
      url: BASE_URL,
      siteName: `${name} Portfolio`,
      title: fullTitle,
      description: description,
      images: ogImages,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description: description,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let settings;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch (error) {
    console.error("Failed to fetch settings for layout:", error);
  }
  const name = settings?.nameEn || 'Sukristiyo';
  const subtitle = settings?.subtitleEn || 'DevOps, SRE & Cloud Engineer';

  const sameAsUrls = [
    settings?.githubUrl,
    settings?.linkedinUrl,
    settings?.twitterUrl,
    settings?.instagramUrl,
    settings?.facebookUrl,
  ].filter(Boolean) as string[];

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
              "name": name,
              "url": "https://sukristiyo.my.id",
              "jobTitle": subtitle,
              "sameAs": sameAsUrls.length > 0 ? sameAsUrls : [
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
