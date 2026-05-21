import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startYear: z.number().int(),
  endYear: z.number().int().optional(),
  descriptionEn: z.string().optional(),
  descriptionId: z.string().optional(),
  order: z.number().int().default(0),
})

export async function GET() {
  try {
    const educations = await prisma.resumeEducation.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(educations)
  } catch (error) {
    console.error('[GET /api/resume/education]', error)
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
    const parsed = educationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    const dataToSave = { ...parsed.data };
    if (dataToSave.descriptionEn) {
      const translated = await translateToIndonesian(dataToSave.descriptionEn);
      if (translated) dataToSave.descriptionId = translated;
    }

    const education = await prisma.resumeEducation.create({ data: dataToSave })
    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error('[POST /api/resume/education]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
