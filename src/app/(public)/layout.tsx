import { prisma } from '@/lib/prisma'
import PublicLayoutClient from '@/components/layout/PublicLayoutClient'

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
}: {
  children: React.ReactNode
}) {
  const { settings, socialLinks } = await getData()

  return (
    <PublicLayoutClient settings={settings} socialLinks={socialLinks}>
      {children}
    </PublicLayoutClient>
  )
}
