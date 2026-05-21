import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const portfolioPatchSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.enum(['web-design', 'applications', 'web-development']).optional(),
  thumbnailUrl: z.string().url().optional(),
  descriptionEn: z.string().min(1).optional(),
  descriptionId: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  year: z.number().int().optional(),
  order: z.number().int().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.portfolioProject.findUnique({ where: { id } })
    if (!project) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
    return NextResponse.json(project)
  } catch (error) {
    console.error('[GET /api/portfolio/[id]]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

import { translateToIndonesian } from '@/lib/translator'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = portfolioPatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    const dataToSave = { ...parsed.data };
    if (dataToSave.descriptionEn) {
      const translated = await translateToIndonesian(dataToSave.descriptionEn);
      if (translated) dataToSave.descriptionId = translated;
    }

    const project = await prisma.portfolioProject.update({
      where: { id },
      data: dataToSave,
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error('[PATCH /api/portfolio/[id]]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.portfolioProject.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/portfolio/[id]]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
