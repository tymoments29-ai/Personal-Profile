import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
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
  authors: [{ name: 'Sukristiyo', url: 'https://sukristiyo.dev' }],
  creator: 'Sukristiyo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'id_ID',
    siteName: 'Sukristiyo Portfolio',
    title: 'Sukristiyo — DevOps, SRE & Cloud Engineer',
    description:
      'Personal portfolio of Sukristiyo — IT professional specializing in DevOps, SRE, Cloud Infrastructure, and Data Center management.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sukristiyo — DevOps, SRE & Cloud Engineer',
    description: 'IT professional specializing in DevOps, SRE, Cloud Infrastructure, and Data Center management.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Toaster
          theme="dark"
          richColors
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'oklch(0.14 0.015 265)',
              border: '1px solid oklch(1 0 0 / 10%)',
              color: 'oklch(0.94 0.01 265)',
            },
          }}
        />
      </body>
    </html>
  )
}
