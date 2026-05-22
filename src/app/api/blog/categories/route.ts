import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog/categories — return distinct categories from all blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    })

    const categories = posts
      .map((p) => p.category)
      .filter(Boolean)
      .sort()

    return NextResponse.json({ categories })
  } catch {
    // Return defaults if DB fails
    return NextResponse.json({
      categories: ['General', 'DevOps', 'Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud', 'Security'],
    })
  }
}
