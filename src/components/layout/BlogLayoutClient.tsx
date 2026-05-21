'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import TabNav from '@/components/layout/TabNav'
import Sidebar from '@/components/layout/Sidebar'
import type { SiteSettings, SocialLink } from '@prisma/client'

interface BlogLayoutClientProps {
  children: React.ReactNode
  settings: SiteSettings | null
  socialLinks: SocialLink[]
}

export default function BlogLayoutClient({ children, settings, socialLinks }: BlogLayoutClientProps) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      {/* ── Sticky Top Bar ── */}
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Profile Row */}
          <div className="flex items-center gap-3 py-3">
            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--gold)] flex-shrink-0">
              {settings?.profilePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.profilePhotoUrl}
                  alt={settings.nameEn}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--gold)] to-amber-600 flex items-center justify-center">
                  <span className="text-base font-bold text-white">S</span>
                </div>
              )}
            </div>

            {/* Name + subtitle */}
            <div className="flex-1 min-w-0">
              <p className="font-outfit font-semibold text-sm text-[var(--foreground)] leading-tight">
                {settings?.nameEn || 'Sukristiyo'}
              </p>
              <p className="text-[var(--muted-foreground)] text-xs truncate">
                {settings?.subtitleEn || 'DevOps · SRE · Cloud Engineer'}
              </p>
            </div>

            {/* Toggle button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/10 transition-all"
              aria-label="Toggle profile"
            >
              <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>

          {/* Expandable Profile Panel */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-[var(--border)]"
              >
                <div className="py-4">
                  <Sidebar settings={settings} socialLinks={socialLinks} mobile />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Navigation */}
          <div className="border-t border-[var(--border)]/50">
            <TabNav />
          </div>

        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
