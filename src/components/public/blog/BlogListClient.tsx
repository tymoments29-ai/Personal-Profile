'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

interface BlogListClientProps {
  posts: {
    id: string
    title: string
    titleId: string | null
    slug: string
    thumbnailUrl: string | null
    category: string
    excerptEn: string
    excerptId: string | null
    publishedAt: Date | null
  }[]
}

const POSTS_PER_PAGE = 6

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const locale = useLocale()
  const t = useTranslations('Blog')

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <h2 className="font-outfit text-3xl font-bold text-[var(--foreground)] mb-8">
        {t('latestArticles').split(' ')[0]} <span className="text-gradient-gold">{t('latestArticles').split(' ').slice(1).join(' ')}</span>
      </h2>

      {/* ── Blog Grid ── */}
      {posts.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {paginatedPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="group glass rounded-2xl overflow-hidden card-hover flex flex-col h-full"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                {/* Thumbnail */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--surface)]">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a27] to-[#0f0f1a] flex items-center justify-center">
                      <span className="text-[var(--gold)]/20 font-outfit text-4xl font-bold">
                        BLOG
                      </span>
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 text-xs font-medium bg-white/60 backdrop-blur-md text-[var(--foreground)] rounded-full border border-[var(--border)]">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-xs mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={post.publishedAt?.toISOString()}>
                      {formatDateShort(post.publishedAt)}
                    </time>
                  </div>
                  
                  <h3 className="font-outfit text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors line-clamp-2">
                    {locale === 'id' ? post.titleId || post.title : post.title}
                  </h3>
                  
                  <p className="text-[var(--muted-foreground)] text-sm line-clamp-3 mt-auto">
                    {locale === 'id' ? post.excerptId || post.excerptEn : post.excerptEn}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      ) : (
        <div className="py-20 text-center glass rounded-2xl">
          <p className="text-[var(--muted-foreground)]">
            {locale === 'id' ? 'Belum ada artikel yang dipublikasikan.' : 'No articles published yet.'}
          </p>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 transition-colors text-[var(--foreground)]"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[var(--gold)] text-white'
                    : 'glass text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-black/5'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 transition-colors text-[var(--foreground)]"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
