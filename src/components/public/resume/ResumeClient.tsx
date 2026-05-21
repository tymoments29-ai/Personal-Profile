'use client'

import { motion, Variants } from 'framer-motion'
import { GraduationCap, Briefcase } from 'lucide-react'
import type { ResumeEducation, ResumeExperience } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'

interface ResumeClientProps {
  education: ResumeEducation[]
  experience: ResumeExperience[]
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ResumeClient({ education, experience }: ResumeClientProps) {
  const locale = useLocale()
  const t = useTranslations('Resume')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* ── Education Timeline ── */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[var(--gold)]" />
            </div>
            <h2 className="font-outfit text-2xl font-bold text-[var(--foreground)]">{t('education')}</h2>
          </div>

          <div className="relative border-l border-[var(--border)] ml-6 space-y-8 pb-4">
            {education.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="relative pl-8"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--gold)] shadow-[0_0_10px_var(--gold-muted)]" />
                
                {/* Content Card */}
                <div className="glass rounded-2xl p-5 hover:border-[var(--gold)]/30 transition-colors">
                  <h3 className="font-outfit text-lg font-semibold text-[var(--foreground)] mb-1">
                    {item.institution}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[var(--gold)] font-medium text-sm">
                      {item.degree} — {item.field}
                    </span>
                    <span className="text-[var(--muted-foreground)] text-xs bg-black/5 px-2 py-0.5 rounded-full">
                      {item.startYear} - {item.endYear || (locale === 'id' ? 'Sekarang' : 'Present')}
                    </span>
                  </div>
                  {(locale === 'id' ? item.descriptionId || item.descriptionEn : item.descriptionEn) && (
                    <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                      {locale === 'id' ? item.descriptionId || item.descriptionEn : item.descriptionEn}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Experience Timeline ── */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[var(--gold)]" />
            </div>
            <h2 className="font-outfit text-2xl font-bold text-[var(--foreground)]">{t('experience')}</h2>
          </div>

          <div className="relative border-l border-[var(--border)] ml-6 space-y-8 pb-4">
            {experience.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="relative pl-8"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--gold)] shadow-[0_0_10px_var(--gold-muted)]" />
                
                {/* Content Card */}
                <div className="glass rounded-2xl p-5 hover:border-[var(--gold)]/30 transition-colors">
                  <h3 className="font-outfit text-lg font-semibold text-[var(--foreground)] mb-1">
                    {item.position}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[var(--gold)] font-medium text-sm">
                      {item.company}
                    </span>
                    <span className="text-[var(--muted-foreground)] text-xs bg-black/5 px-2 py-0.5 rounded-full">
                      {item.startDate} - {item.endDate || (locale === 'id' ? 'Sekarang' : 'Present')}
                    </span>
                  </div>
                  
                  {(locale === 'id' ? item.descriptionId || item.descriptionEn : item.descriptionEn) && (
                    <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-4">
                      {locale === 'id' ? item.descriptionId || item.descriptionEn : item.descriptionEn}
                    </p>
                  )}

                  {item.responsibilities.length > 0 && (
                    <ul className="space-y-2">
                      {item.responsibilities.map((resp, i) => (
                        <li key={i} className="text-[var(--muted-foreground)] text-sm flex items-start gap-2">
                          <span className="text-[var(--gold)] mt-1.5 text-[10px]">♦</span>
                          <span className="flex-1">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  )
}
