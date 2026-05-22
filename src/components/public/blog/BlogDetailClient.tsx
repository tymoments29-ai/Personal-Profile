'use client'

import { useEffect, useCallback } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ChevronLeft, Share2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

type SerializedBlogPost = {
  id: string
  title: string
  titleId: string | null
  slug: string
  thumbnailUrl: string | null
  category: string
  excerptEn: string
  excerptId: string | null
  contentEn: string
  contentId: string | null
  status: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

interface BlogDetailClientProps {
  post: SerializedBlogPost
  readingTime: number
}



export default function BlogDetailClient({ post, readingTime }: BlogDetailClientProps) {
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

  // Add copy buttons to all code blocks
  const addCopyButtons = useCallback(() => {
    const contentDiv = document.getElementById('blog-content')
    if (!contentDiv) return

    contentDiv.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return // Already added

      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-wrapper'
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)

      const copyBtn = document.createElement('button')
      copyBtn.className = 'copy-btn'
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy`
      
      copyBtn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent || ''
        await navigator.clipboard.writeText(code)
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`
        copyBtn.classList.add('copied')
        setTimeout(() => {
          copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy`
          copyBtn.classList.remove('copied')
        }, 2000)
      })

      wrapper.appendChild(copyBtn)
    })
  }, [])

  useEffect(() => {
    addCopyButtons()
  }, [postContent, addCopyButtons])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: postTitle, text: postExcerpt, url: window.location.href })
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="relative">
      {/* ── Reading Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--gold)] origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-6xl mx-auto">

        {/* ── Back Navigation ── */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors group mb-6"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('back')}
        </Link>

        {/* ── Article Header ── */}
        <header className="mb-8 pb-8 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} {t('readTime')}
              </span>
            </div>
          </div>

          <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight mb-4">
            {postTitle}
          </h1>

          {postExcerpt && (
            <p className="text-base text-[var(--muted-foreground)] leading-relaxed max-w-3xl mb-6">
              {postExcerpt}
            </p>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            {t('share')}
          </button>
        </header>

        {/* ── Hero Image ── */}
        {post.thumbnailUrl && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border)] mb-10">
            <Image
              src={post.thumbnailUrl}
              alt={postTitle}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* ── Article Content ── */}
        <main>
          <div
            id="blog-content"
            className="do-article-content"
            dangerouslySetInnerHTML={{ __html: postContent }}
          />
        </main>
      </div>
    </div>
  )
}
