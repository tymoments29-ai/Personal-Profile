import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const experiencePatchSchema = z.object({
  company: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  startDate: z.string().min(1).optional(),
  endDate: z.string().nullable().optional(),
  descriptionEn: z.string().min(1).optional(),
  descriptionId: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  order: z.number().int().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const experience = await prisma.resumeExperience.findUnique({ where: { id } })
    if (!experience) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
    return NextResponse.json(experience)
  } catch (error) {
    console.error('[GET /api/resume/experience/[id]]', error)
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
    const parsed = experiencePatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    const dataToSave = { ...parsed.data };
    if (dataToSave.descriptionEn) {
      const translated = await translateToIndonesian(dataToSave.descriptionEn);
      if (translated) dataToSave.descriptionId = translated;
    }

    const experience = await prisma.resumeExperience.update({
      where: { id },
      data: dataToSave,
    })
    return NextResponse.json(experience)
  } catch (error) {
    console.error('[PATCH /api/resume/experience/[id]]', error)
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
    await prisma.resumeExperience.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/resume/experience/[id]]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
