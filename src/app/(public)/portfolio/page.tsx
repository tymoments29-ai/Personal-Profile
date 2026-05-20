import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PortfolioClient from '@/components/public/portfolio/PortfolioClient'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Explore recent projects, web applications, and infrastructure implementations by Sukristiyo.',
}

async function getPortfolioProjects() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: [
        { order: 'asc' },
        { year: 'desc' },
      ],
    })
    return projects
  } catch {
    return []
  }
}

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects()

  return <PortfolioClient projects={projects} />
}
