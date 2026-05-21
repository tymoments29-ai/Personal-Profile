'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ChevronLeft, Share2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'

interface BlogDetailClientProps {
  post: BlogPost
  readingTime: number
}

interface TocItem {
  id: string
  text: string
  level: number
}

export default function BlogDetailClient({ post, readingTime }: BlogDetailClientProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const locale = useLocale()
  const t = useTranslations('Blog')
  
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const postContent = locale === 'id' ? post.contentId || post.contentEn : post.contentEn
  const postTitle = locale === 'id' ? post.titleId || post.title : post.title
  const postExcerpt = locale === 'id' ? post.excerptId || post.excerptEn : post.excerptEn

  useEffect(() => {
    // Generate TOC from content headers (h2, h3)
    const parser = new DOMParser()
    const doc = parser.parseFromString(postContent, 'text/html')
    const headings = Array.from(doc.querySelectorAll('h2, h3'))
    
    const tocItems = headings.map((heading) => {
      // Add id to the actual DOM later if needed, but for now we just extract text
      const text = heading.textContent || ''
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      return {
        id,
        text,
        level: Number(heading.tagName.replace('H', ''))
      }
    })
    
    setToc(tocItems)

    // Optional: Add IDs to the content div headings for scroll spy
    const contentDiv = document.getElementById('blog-content')
    if (contentDiv) {
      const domHeadings = contentDiv.querySelectorAll('h2, h3')
      domHeadings.forEach((h) => {
        const text = h.textContent || ''
        h.id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      })
    }

    // Intersection Observer for TOC active state
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -80% 0px',
    })

    const headingElements = document.querySelectorAll('#blog-content h2, #blog-content h3')
    headingElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [postContent])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          text: postExcerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Could add a toast here
    }
  }

  return (
    <div className="relative">
      {/* ── Reading Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--gold)] origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ── Back Navigation ── */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors group"
        >
          <div className="w-8 h-8 rounded-full glass flex items-center justify-center group-hover:bg-[var(--gold)]/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          {t('back')}
        </Link>

        {/* ── Article Header ── */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="px-3 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt?.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <Clock className="w-4 h-4" />
              <span>{readingTime} {t('readTime')}</span>
            </div>
          </div>

          <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight">
            {postTitle}
          </h1>

          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-3xl">
            {postExcerpt}
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-[var(--foreground)] hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {t('share')}
            </button>
          </div>
        </header>

        {/* ── Hero Image ── */}
        {post.thumbnailUrl && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass border border-[var(--border)]">
            <Image
              src={post.thumbnailUrl}
              alt={postTitle}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* ── Content Layout ── */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div
              id="blog-content"
              className="tiptap-content max-w-none"
              dangerouslySetInnerHTML={{ __html: postContent }}
            />
          </main>

          {/* Table of Contents (Sidebar) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-outfit text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4">
                  {t('toc')}
                </h3>
                <nav className="space-y-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm py-1.5 transition-colors ${
                        activeId === item.id
                          ? 'text-[var(--gold)] font-medium'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                      }`}
                      style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

        </div>
      </div>
    </div>
  )
}
