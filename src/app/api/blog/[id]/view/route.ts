import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/blog/[id]/view - Increment post views atomically
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Increment views atomically by 1
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        id: true,
        views: true,
      },
    })

    return NextResponse.json({ success: true, views: post.views })
  } catch (error) {
    console.error('[BLOG_VIEW_INCREMENT_ERROR]', error)
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
  }
}
