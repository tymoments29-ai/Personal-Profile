import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleId: z.string().optional(),
  slug: z.string().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  category: z.string().default('General'),
  tags: z.string().default(''),
  excerptEn: z.string().default(''),
  excerptId: z.string().optional(),
  contentEn: z.string().default(''),
  contentId: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  publishedAt: z.string().optional().nullable(),
})

// GET /api/blog — public list of published posts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '9')
  const category = searchParams.get('category')
  const all = searchParams.get('all') === 'true' // admin: show all including drafts

  const session = await auth()
  const showDrafts = all && !!session

  const where = showDrafts
    ? {}
    : { status: 'published' as const }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        ...where,
        ...(category && category !== 'All' ? { category } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        titleId: true,
        slug: true,
        thumbnailUrl: true,
        category: true,
        excerptEn: true,
        excerptId: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ])

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

import { translateToIndonesian } from '@/lib/translator'

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = blogPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const slug = data.slug || (slugify(data.title) + '-' + Date.now().toString(36))

  const titleId = await translateToIndonesian(data.title) || undefined;
  const excerptId = data.excerptEn ? await translateToIndonesian(data.excerptEn) || undefined : undefined;
  const contentId = data.contentEn ? await translateToIndonesian(data.contentEn) || undefined : undefined;

  const post = await prisma.blogPost.create({
    data: {
      ...data,
      slug,
      titleId,
      excerptId,
      contentId,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
