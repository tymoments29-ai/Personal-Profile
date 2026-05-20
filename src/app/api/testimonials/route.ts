import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const testimonialSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  quoteEn: z.string().min(1),
  quoteId: z.string().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('[GET /api/testimonials]', error)
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
    const parsed = testimonialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.create({ data: parsed.data })
    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('[POST /api/testimonials]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
