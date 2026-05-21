'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, FileText, Briefcase, BookOpen, Mail } from 'lucide-react'

const tabs = [
  { href: '/about', label: 'About', icon: User },
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/contact', label: 'Contact', icon: Mail },
]

import { ThemeToggle } from '@/components/layout/ThemeToggle'

export default function TabNav() {
  const pathname = usePathname()

  return (
    <nav
      className="glass rounded-2xl p-1.5 flex items-center justify-between gap-2"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="flex flex-1 gap-1" role="list">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)

          return (
            <li key={href} className="flex-1" role="none">
              <Link
                href={href}
                className={`
                  relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
                  px-2 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium
                  transition-colors duration-200 w-full
                  ${isActive
                    ? 'text-[var(--gold)]'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-xl bg-[var(--gold-muted)] border border-[var(--gold)]/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}

                <Icon className={`relative w-4 h-4 flex-shrink-0 ${isActive ? 'text-[var(--gold)]' : ''}`} />
                <span className="relative hidden xs:block sm:block">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      
      {/* Theme Toggle Button */}
      <div className="flex-shrink-0 border-l border-[var(--border)] pl-2 ml-1">
        <ThemeToggle />
      </div>
    </nav>
  )
}
