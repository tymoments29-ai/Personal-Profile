'use client'

import Link from 'next/link'
import { Home, CloudOff } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--gold)]/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-8"
      >
        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-3xl glass flex items-center justify-center border border-[var(--gold)]/30 glow-gold"
          >
            <CloudOff className="w-12 h-12 text-[var(--gold)]" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
            404
          </h2>
          <h3 className="font-outfit text-2xl md:text-3xl font-bold text-[var(--gold)] animate-shimmer">
            Lost in the Cloud
          </h3>
          <p className="text-[var(--muted-foreground)] max-w-md mx-auto text-sm md:text-base">
            The page you're looking for seems to have drifted away. Let's get you back to familiar territory.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--gold)] text-white font-semibold shadow-[0_0_20px_-5px_rgba(var(--gold-rgb),0.5)] hover:bg-[var(--gold-hover)] transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
