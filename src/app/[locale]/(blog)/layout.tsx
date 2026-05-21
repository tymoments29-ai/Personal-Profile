import { prisma } from '@/lib/prisma'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ReactNode } from 'react'
import BlogLayoutClient from '@/components/layout/BlogLayoutClient'
import ParticleBackground from '@/components/layout/ParticleBackground'
import type { SiteSettings, SocialLink } from '@prisma/client'

async function getData(): Promise<{ settings: SiteSettings | null; socialLinks: SocialLink[] }> {
  try {
    const [settings, socialLinks] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      }),
    ])
    return { settings, socialLinks }
  } catch {
    return { settings: null, socialLinks: [] }
  }
}

export default async function BlogArticleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { settings, socialLinks } = await getData()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen bg-[var(--bg-primary)] relative">
        <ParticleBackground />
        <BlogLayoutClient settings={settings} socialLinks={socialLinks}>
          {children}
        </BlogLayoutClient>
      </div>
    </NextIntlClientProvider>
  )
}
