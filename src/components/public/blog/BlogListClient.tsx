'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
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
    views: number
  }[]
}

const POSTS_PER_PAGE = 6

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState('All')
  const locale = useLocale()
  const t = useTranslations('Blog')

  // Derive unique categories from posts, sorted
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))).sort()
    return ['All', ...cats]
  }, [posts])

  // Filter posts by active category
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts
    return posts.filter((p) => p.category === activeCategory)
  }, [posts, activeCategory])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setCurrentPage(1) // reset to page 1 on filter change
  }

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
      <h2 className="font-outfit text-3xl font-bold text-[var(--foreground)] mb-6">
        {t('latestArticles').split(' ')[0]} <span className="text-gradient-gold">{t('latestArticles').split(' ').slice(1).join(' ')}</span>
      </h2>

      {/* ── Category Filter ── */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-[var(--gold)] text-white border-[var(--gold)] shadow-sm'
                  : 'bg-transparent text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--gold)]/50 hover:text-[var(--foreground)]'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'opacity-80' : 'opacity-50'}`}>
                  ({posts.filter((p) => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Blog Grid ── */}
      {filteredPosts.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedPosts.map((post) => (
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
                    <div className="flex items-center gap-4 text-[var(--muted-foreground)] text-xs mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <time dateTime={post.publishedAt?.toISOString()}>
                          {formatDateShort(post.publishedAt)}
                        </time>
                      </span>
                      {post.views !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.views} {t('views')}</span>
                        </span>
                      )}
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
        </AnimatePresence>
      ) : (
        <div className="py-20 text-center glass rounded-2xl">
          <p className="text-[var(--muted-foreground)]">
            {locale === 'id'
              ? `Belum ada artikel dengan kategori "${activeCategory}".`
              : `No articles found in "${activeCategory}".`}
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
