'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TabNav from '@/components/layout/TabNav'
import ParticleBackground from '@/components/layout/ParticleBackground'
import { motion, AnimatePresence } from 'framer-motion'
import type { SiteSettings, SocialLink } from '@prisma/client'

interface PublicLayoutClientProps {
  children: React.ReactNode
  settings: SiteSettings | null
  socialLinks: SocialLink[]
}

export default function PublicLayoutClient({ children, settings, socialLinks }: PublicLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* SEO: Dynamic Canonical & Hreflang Tags */}
      {(() => {
        const basePath = pathname.replace(/^\/(en|id)/, '') || '/'
        const enUrl = `https://sukristiyo.my.id/en${basePath === '/' ? '' : basePath}`
        const idUrl = `https://sukristiyo.my.id/id${basePath === '/' ? '' : basePath}`
        const canonicalUrl = `https://sukristiyo.my.id${pathname}`
        
        return (
          <>
            <link rel="canonical" href={canonicalUrl} />
            <link rel="alternate" hrefLang="en" href={enUrl} />
            <link rel="alternate" hrefLang="id" href={idUrl} />
            <link rel="alternate" hrefLang="x-default" href={enUrl} />
          </>
        )
      })()}

      <ParticleBackground />

      {/* Desktop: 2-column layout */}
      <div className="relative flex min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 gap-6 py-8">

        {/* Left Column: Fixed Sidebar (desktop) */}
        <aside className="hidden lg:block w-[320px] xl:w-[360px] flex-shrink-0">
          <div className="sticky top-8">
            <Sidebar settings={settings} socialLinks={socialLinks} />
          </div>
        </aside>

        {/* Right Column: Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile: Top profile bar */}
          <div className="lg:hidden mb-4">
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--gold)] flex-shrink-0">
                {settings?.profilePhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.profilePhotoUrl}
                    alt={settings.nameEn}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--gold)] to-amber-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">S</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-outfit font-semibold text-[var(--foreground)] text-sm truncate">
                  {settings?.nameEn || 'Sukristiyo'}
                </h2>
                <p className="text-[var(--muted-foreground)] text-xs truncate">
                  {settings?.subtitleEn || 'DevOps · SRE · Cloud Engineer'}
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1"
                aria-label="Toggle profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={sidebarOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                </svg>
              </button>
            </div>

            {/* Mobile sidebar drawer */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-2"
                >
                  <Sidebar settings={settings} mobile socialLinks={socialLinks} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Navigation */}
          <TabNav />

          {/* Page Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mt-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
