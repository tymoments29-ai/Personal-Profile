'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TabNav from '@/components/layout/TabNav'
import { motion, AnimatePresence } from 'framer-motion'
import type { SiteSettings } from '@prisma/client'

interface PublicLayoutClientProps {
  children: React.ReactNode
  settings: SiteSettings | null
}

export default function PublicLayoutClient({ children, settings }: PublicLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, oklch(0.75 0.15 70) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 -right-40 w-96 h-96 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, oklch(0.65 0.15 250) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Desktop: 2-column layout */}
      <div className="relative flex min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 gap-6 py-8">

        {/* Left Column: Fixed Sidebar (desktop) */}
        <aside className="hidden lg:block w-[320px] xl:w-[360px] flex-shrink-0">
          <div className="sticky top-8">
            <Sidebar settings={settings} />
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
                    <span className="text-xl font-bold text-black">S</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-outfit font-semibold text-white text-sm truncate">
                  {settings?.nameEn || 'Sukristiyo'}
                </h2>
                <p className="text-[var(--muted-foreground)] text-xs truncate">
                  {settings?.subtitleEn || 'DevOps · SRE · Cloud Engineer'}
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-[var(--muted-foreground)] hover:text-white transition-colors p-1"
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
                  <Sidebar settings={settings} mobile />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Navigation */}
          <TabNav />

          {/* Page Content */}
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
