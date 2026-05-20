import { prisma } from '@/lib/prisma'
import PublicLayoutClient from '@/components/layout/PublicLayoutClient'

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    return settings
  } catch {
    return null
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <PublicLayoutClient settings={settings}>
      {children}
    </PublicLayoutClient>
  )
}
