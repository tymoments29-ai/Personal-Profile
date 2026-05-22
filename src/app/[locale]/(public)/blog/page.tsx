import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogListClient from '@/components/public/blog/BlogListClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles, tutorials, and thoughts on DevOps, Cloud Infrastructure, and Software Engineering.',
}

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        titleId: true,
        slug: true,
        thumbnailUrl: true,
        category: true,
        tags: true,
        excerptEn: true,
        excerptId: true,
        publishedAt: true,
      },
    })
    return posts
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return <BlogListClient posts={posts} />
}
