'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center p-8 bg-card border border-border shadow-2xl rounded-3xl max-w-sm w-full text-center"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-background p-4 rounded-full border border-border shadow-sm">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">Memuat Halaman...</h3>
        <p className="text-muted-foreground text-sm">
          Mohon tunggu sebentar, sedang menyiapkan data dan menyinkronkan sesi Anda.
        </p>
      </motion.div>
    </div>
  )
}
