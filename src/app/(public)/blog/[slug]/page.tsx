import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogDetailClient from '@/components/public/blog/BlogDetailClient'
import { estimateReadingTime } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })
  
  if (!post || post.status !== 'published') return null
  return post
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerptEn,
    openGraph: {
      title: post.title,
      description: post.excerptEn,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerptEn,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  // Calculate reading time
  const readingTime = estimateReadingTime(post.contentEn)

  return <BlogDetailClient post={post} readingTime={readingTime} />
}

// Generate static paths for all published posts (SSG)
export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    select: { slug: true },
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
