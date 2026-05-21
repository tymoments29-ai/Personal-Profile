import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  descriptionEn: z.string().min(1),
  descriptionId: z.string().optional(),
  responsibilities: z.array(z.string()),
  order: z.number().int().default(0),
})

export async function GET() {
  try {
    const experiences = await prisma.resumeExperience.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('[GET /api/resume/experience]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

import { translateToIndonesian } from '@/lib/translator'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = experienceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    const dataToSave = { ...parsed.data };
    if (dataToSave.descriptionEn) {
      const translated = await translateToIndonesian(dataToSave.descriptionEn);
      if (translated) dataToSave.descriptionId = translated;
    }

    const experience = await prisma.resumeExperience.create({ data: dataToSave })
    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('[POST /api/resume/experience]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
