import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ResumeClient from '@/components/public/resume/ResumeClient'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Education and professional experience timeline of Sukristiyo.',
}

async function getResumeData() {
  try {
    const [education, experience] = await Promise.all([
      prisma.resumeEducation.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.resumeExperience.findMany({
        orderBy: { order: 'asc' },
      }),
    ])
    return { education, experience }
  } catch {
    return { education: [], experience: [] }
  }
}

export default async function ResumePage() {
  const { education, experience } = await getResumeData()

  return <ResumeClient education={education} experience={experience} />
}
