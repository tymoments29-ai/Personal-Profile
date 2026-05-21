import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ContactClient from '@/components/public/contact/ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Sukristiyo for collaboration, consulting, or career opportunities.',
}

async function getContactSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: {
        email: true,
        phone: true,
        location: true,
      },
    })
    return settings
  } catch {
    return null
  }
}

export default async function ContactPage() {
  const settings = await getContactSettings()

  return <ContactClient settings={settings} />
}
