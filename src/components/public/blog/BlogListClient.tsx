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
    tags: string
    excerptEn: string
    excerptId: string | null
    publishedAt: Date | null
  }[]
}

const POSTS_PER_PAGE = 6

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  DevOps:     'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  Linux:      'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
  Docker:     'bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30',
  Kubernetes: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  'CI/CD':    'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
  Cloud:      'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  Security:   'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
  Networking: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
  SRE:        'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  General:    'bg-white/60 text-[var(--foreground)] border-[var(--border)]',
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const locale = useLocale()
  const t = useTranslations('Blog')

  // Get unique categories from posts
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))]

  // Filter by category
  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === selectedCategory)

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <h2 className="font-outfit text-3xl font-bold text-[var(--foreground)]">
        {t('latestArticles').split(' ')[0]}{' '}
        <span className="text-gradient-gold">{t('latestArticles').split(' ').slice(1).join(' ')}</span>
      </h2>

      {/* ── Category Filter ── */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={[
                'px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                selectedCategory === cat
                  ? 'bg-[var(--gold)] text-white border-[var(--gold)] shadow-md shadow-[var(--gold)]/20'
                  : 'glass text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── Blog Grid ── */}
      {paginatedPosts.length > 0 ? (
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {paginatedPosts.map((post) => {
            const tags = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
            const catColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['General']

            return (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group glass rounded-2xl overflow-hidden card-hover flex flex-col h-full"
              >
                <Link href={`/${locale}/blog/${post.slug}`} className="flex flex-col h-full">
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
                        <span className="text-[var(--gold)]/20 font-outfit text-4xl font-bold">BLOG</span>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${catColor}`}>
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

                    <p className="text-[var(--muted-foreground)] text-sm line-clamp-2 mb-3">
                      {locale === 'id' ? post.excerptId || post.excerptEn : post.excerptEn}
                    </p>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-[var(--border)]">
                        {tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]"
                          >
                            {tag}
                          </span>
                        ))}
                        {tags.length > 4 && (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]">
                            +{tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.article>
            )
          })}
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
