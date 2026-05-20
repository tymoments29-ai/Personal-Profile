import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const portfolioSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['web-design', 'applications', 'web-development']).default('web-development'),
  thumbnailUrl: z.string().url().optional(),
  descriptionEn: z.string().min(1),
  descriptionId: z.string().optional(),
  techStack: z.array(z.string()),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  year: z.number().int().default(new Date().getFullYear()),
  order: z.number().int().default(0),
})

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: [{ order: 'asc' }, { year: 'desc' }],
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('[GET /api/portfolio]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = portfolioSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    const project = await prisma.portfolioProject.create({ data: parsed.data })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('[POST /api/portfolio]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
