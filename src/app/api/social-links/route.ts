import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  iconName: z.string().min(1),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error('[GET /api/social-links]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = schema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    const link = await prisma.socialLink.create({ data: parsed.data })
    revalidatePath('/')
    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('[POST /api/social-links]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
