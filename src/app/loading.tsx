'use client'

import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Flying Rocket Animation */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            rotate: [45, 40, 50, 45]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative mb-10"
        >
          <Rocket className="w-16 h-16 text-primary" />
          
          {/* Fire/Thrust Effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.5, 0.8, 1.2],
              opacity: [0.8, 0, 1, 0.5]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-500 rounded-full blur-[8px] -z-10"
          />
          <motion.div
            animate={{ 
              scale: [0.8, 1.2, 0.5, 1],
              opacity: [0.5, 0, 0.8, 0]
            }}
            transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
            className="absolute -bottom-6 -left-6 w-8 h-8 bg-yellow-400 rounded-full blur-[10px] -z-10"
          />
        </motion.div>

        {/* Text */}
        <h2 className="text-3xl font-bold tracking-widest text-foreground uppercase mb-2 flex items-center">
          Loading
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
          >
            ...
          </motion.span>
        </h2>
        <p className="text-muted-foreground font-medium">
          Menyiapkan halaman untuk Anda
        </p>
      </div>
    </div>
  )
}
