import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogDetailClient from '@/components/public/blog/BlogDetailClient'
import { estimateReadingTime } from '@/lib/utils'

// Force dynamic rendering — prevents SSG issues with DB data at build time
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string, locale: string }>
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    })
    if (!post || post.status !== 'published') return null
    return post
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const title = locale === 'id' ? post.titleId || post.title : post.title
  const description = locale === 'id' ? post.excerptId || post.excerptEn : post.excerptEn

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug, locale } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  // Calculate reading time based on locale
  const content = locale === 'id' ? post.contentId || post.contentEn : post.contentEn
  const readingTime = estimateReadingTime(content)

  // Serialize Date fields to strings for client component compatibility
  const serializedPost = {
    ...post,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }

  return <BlogDetailClient post={serializedPost} readingTime={readingTime} />
}
