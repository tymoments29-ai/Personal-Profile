'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { Testimonial } from '@prisma/client'

interface TestimonialSliderProps {
  testimonials: Testimonial[]
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const prev = () => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }

  const next = () => {
    setDirection(1)
    setCurrent((c) => (c + 1) % testimonials.length)
  }

  const testimonial = testimonials[current]

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      {/* Quote icon */}
      <div className="absolute top-4 right-6 text-[var(--gold)]/10 text-8xl font-serif leading-none select-none">
        &ldquo;
      </div>

      <div className="min-h-[160px] flex flex-col justify-between">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={testimonial.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < testimonial.rating ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-white/10'}`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6 italic">
              &ldquo;{testimonial.quoteEn}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--gold)]/30 flex-shrink-0">
                {testimonial.avatarUrl ? (
                  <Image src={testimonial.avatarUrl} alt={testimonial.name} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--gold)] to-amber-700 flex items-center justify-center">
                    <span className="text-sm font-bold text-black">{testimonial.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-outfit font-semibold text-white text-sm">{testimonial.name}</p>
                <p className="text-[var(--muted-foreground)] text-xs">{testimonial.position}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-4 bg-[var(--gold)]' : 'bg-white/20'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-1">
            <button
              onClick={prev}
              className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-[var(--muted-foreground)] hover:text-white hover:border-white/30 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-[var(--muted-foreground)] hover:text-white hover:border-white/30 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
