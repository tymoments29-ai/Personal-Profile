import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import AboutClient from '@/components/public/about/AboutClient'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Sukristiyo — IT professional specializing in DevOps, SRE, and Cloud Infrastructure with hands-on experience in enterprise data center management.',
}

async function getData() {
  try {
    const [settings, testimonials, services, technologies] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      }),
      prisma.service.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.technology.findMany({
        orderBy: { order: 'asc' },
      }),
    ])
    return { settings, testimonials, services, technologies }
  } catch {
    return { settings: null, testimonials: [], services: [], technologies: [] }
  }
}

export default async function AboutPage() {
  const { settings, testimonials, services, technologies } = await getData()

  return <AboutClient settings={settings} testimonials={testimonials} services={services} technologies={technologies} />
}
