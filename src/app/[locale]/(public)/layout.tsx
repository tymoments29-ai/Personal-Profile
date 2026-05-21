import { prisma } from '@/lib/prisma'
import PublicLayoutClient from '@/components/layout/PublicLayoutClient'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';

async function getData() {
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

export default async function PublicLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  const { settings, socialLinks } = await getData()
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <PublicLayoutClient settings={settings} socialLinks={socialLinks}>
        {children}
      </PublicLayoutClient>
    </NextIntlClientProvider>
  )
}
