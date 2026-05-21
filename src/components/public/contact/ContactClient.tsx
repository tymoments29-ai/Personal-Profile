'use client'

import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Send, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import('./MapComponent'), { ssr: false })

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().max(0, 'Spam detected').optional(), // Honeypot
})

type ContactFormValues = z.infer<typeof contactSchema>

interface ContactClientProps {
  settings: {
    email: string
    phone: string
    location: string
  } | null
}

export default function ContactClient({ settings }: ContactClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslations('Contact')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
      website: '', // honeypot
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to send message')

      toast.success('Message sent successfully!', {
        description: "I'll get back to you as soon as possible.",
      })
      reset()
    } catch (error) {
      toast.error('Failed to send message.', {
        description: 'Please try again later or contact me directly via email.',
      })
    } finally {
      setIsSubmitting(false)
    }
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <h2 className="font-outfit text-3xl font-bold text-[var(--foreground)] mb-8">
        {t('title').split(' ')[0]} <span className="text-gradient-gold">{t('title').split(' ').slice(1).join(' ')}</span>
      </h2>

      {/* ── Map Section ── */}
      <motion.section variants={itemVariants}>
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden glass border border-[var(--border)] relative z-0">
          <Map location={settings?.location || 'Jakarta, Indonesia'} />
          
          {/* Overlay gradient to blend map edges */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_40px_rgba(15,15,26,0.8)] z-10" />
        </div>
      </motion.section>

      {/* ── Contact Form ── */}
      <motion.section variants={itemVariants}>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <h3 className="font-outfit text-xl font-bold text-[var(--foreground)] mb-6">Contact Form</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Honeypot field (hidden from users, traps bots) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" id="website" {...register('website')} tabIndex={-1} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--muted-foreground)]">
                  {t('name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className={`w-full bg-black/5 border ${
                    errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--gold)]'
                  } rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-black/40 outline-none transition-colors`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--muted-foreground)]">
                  {t('email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full bg-black/5 border ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--gold)]'
                  } rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-black/40 outline-none transition-colors`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--muted-foreground)]">
                {t('message')} <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('message')}
                rows={5}
                className={`w-full bg-black/5 border ${
                  errors.message ? 'border-red-500 focus:border-red-500' : 'border-[var(--border)] focus:border-[var(--gold)]'
                } rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-black/40 outline-none transition-colors resize-none`}
                placeholder="How can I help you?"
              />
              {errors.message && (
                <p className="text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-white font-semibold rounded-xl px-8 py-3.5 hover:bg-[var(--gold-hover)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('sending')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    {t('send')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.section>
    </motion.div>
  )
}
