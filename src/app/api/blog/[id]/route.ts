import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  titleId: z.string().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  category: z.string().optional(),
  excerptEn: z.string().optional(),
  excerptId: z.string().optional(),
  contentEn: z.string().optional(),
  contentId: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.string().optional().nullable(),
})

// GET /api/blog/[id] — get single post by id or slug
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Try by ID first, then slug
  const post = await prisma.blogPost.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  })

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Public route: only show published posts without admin session
  const session = await auth()
  if (post.status !== 'published' && !session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}

import { translateToIndonesian } from '@/lib/translator'

// PATCH /api/blog/[id] — update post (admin only)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const updateData: Record<string, unknown> = { ...data }

  if (data.title) {
    updateData.slug = slugify(data.title) + '-' + id.slice(-6)
    updateData.titleId = await translateToIndonesian(data.title) || undefined;
  }
  if (data.excerptEn) {
    updateData.excerptId = await translateToIndonesian(data.excerptEn) || undefined;
  }
  if (data.contentEn) {
    updateData.contentId = await translateToIndonesian(data.contentEn) || undefined;
  }
  if (data.publishedAt !== undefined) {
    updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(post)
}

// DELETE /api/blog/[id] — delete post (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.blogPost.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
