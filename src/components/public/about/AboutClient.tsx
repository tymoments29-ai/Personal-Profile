'use client'

import { motion, Variants } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import type { SiteSettings, Testimonial, Service, Technology } from '@prisma/client'
import TestimonialSlider from './TestimonialSlider'

interface AboutClientProps {
  settings: SiteSettings | null
  testimonials: Testimonial[]
  services: Service[]
  technologies: Technology[]
}



const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function AboutClient({ settings, testimonials, services, technologies }: AboutClientProps) {
  const aboutText =
    settings?.aboutTextEn ||
    `I'm a dedicated IT professional specializing in DevOps, Site Reliability Engineering (SRE), and Cloud Infrastructure. With hands-on experience managing enterprise-grade data centers and cloud environments, I bridge the gap between development and operations to deliver reliable, scalable, and secure systems.`

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── About Text ── */}
      <motion.section variants={itemVariants}>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <h2 className="font-outfit text-2xl font-bold text-white mb-4">
            About <span className="text-gradient-gold">Me</span>
          </h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
            {aboutText}
          </p>

          {/* Tech Stack Pills */}
          <div className="mt-6">
            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
              Core Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-[var(--muted-foreground)] hover:text-[var(--gold)] hover:border-[var(--gold)]/30 transition-colors cursor-default"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Services Grid ── */}
      <motion.section variants={itemVariants}>
        <h2 className="font-outfit text-xl font-semibold text-white mb-4">
          What I <span className="text-gradient-gold">Do</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => {
            const Icon = (LucideIcons as any)[service.iconName] || LucideIcons.Check
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`glass rounded-2xl p-5 bg-gradient-to-br ${service.colorClass} card-hover cursor-default`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${service.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-outfit font-semibold text-white text-sm mb-1.5">
                      {service.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-xs leading-relaxed break-words whitespace-pre-wrap">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <motion.section variants={itemVariants}>
          <h2 className="font-outfit text-xl font-semibold text-white mb-4">
            What People <span className="text-gradient-gold">Say</span>
          </h2>
          <TestimonialSlider testimonials={testimonials} />
        </motion.section>
      )}
    </motion.div>
  )
}
