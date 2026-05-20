import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { sendContactNotification } from '@/lib/resend'

const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Honeypot check — bots fill this field, humans don't see it
    if (body.website && body.website.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    const { fullName, email, message } = parsed.data

    const contactMessage = await prisma.contactMessage.create({
      data: { fullName, email, message },
    })

    await sendContactNotification({ fullName, email, message })

    return NextResponse.json(contactMessage, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contact]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
