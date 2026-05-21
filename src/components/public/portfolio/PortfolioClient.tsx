'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Eye, Code2, X } from 'lucide-react'
import type { PortfolioProject } from '@prisma/client'

interface PortfolioClientProps {
  projects: PortfolioProject[]
}

const CATEGORIES = [
  { id: 'All', label: 'All Projects' },
  { id: 'web-design', label: 'Web Design' },
  { id: 'applications', label: 'Applications' },
  { id: 'web-development', label: 'Web Development' },
]

export default function PortfolioClient({ projects }: PortfolioClientProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter)

  return (
    <div className="space-y-8">
      
      {/* ── Header & Filter ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="font-outfit text-3xl font-bold text-[var(--foreground)]">
          <span className="text-gradient-gold">Portfolio</span>
        </h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                activeFilter === cat.id
                  ? 'bg-[var(--gold)] text-white'
                  : 'bg-black/5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Projects Grid ── */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-2xl overflow-hidden glass card-hover cursor-pointer aspect-video"
              onClick={() => setSelectedProject(project)}
            >
              {/* Thumbnail */}
              {project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a27] to-[#0f0f1a] flex items-center justify-center">
                  <span className="text-[var(--muted-foreground)] font-outfit text-xl font-medium opacity-30">
                    {project.title}
                  </span>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-[var(--gold)] text-white flex items-center justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-outfit text-lg font-bold text-[var(--foreground)] mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {project.title}
                </h3>
                <p className="text-[var(--gold)] text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {CATEGORIES.find(c => c.id === project.category)?.label || project.category}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[var(--muted-foreground)]">No projects found in this category.</p>
        </div>
      )}

      {/* ── Project Detail Modal ── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-3xl glass-strong rounded-2xl overflow-hidden shadow-2xl border border-[var(--gold)]/20 flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-[var(--foreground)] hover:bg-[var(--gold)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto custom-scrollbar">
                {/* Modal Thumbnail */}
                <div className="relative w-full aspect-video bg-[var(--surface)]">
                  {selectedProject.thumbnailUrl && (
                    <Image
                      src={selectedProject.thumbnailUrl}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Modal Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="font-outfit text-2xl font-bold text-[var(--foreground)] mb-2">
                      {selectedProject.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[var(--gold)] font-medium">
                        {CATEGORIES.find(c => c.id === selectedProject.category)?.label || selectedProject.category}
                      </span>
                      <span className="text-[var(--muted-foreground)]">&bull;</span>
                      <span className="text-[var(--muted-foreground)]">{selectedProject.year}</span>
                    </div>
                  </div>

                  <div 
                    className="prose prose-invert prose-sm sm:prose-base max-w-none text-[var(--muted-foreground)]"
                    dangerouslySetInnerHTML={{ __html: selectedProject.descriptionEn }}
                  />

                  {/* Tech Stack */}
                  {selectedProject.techStack.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.techStack.map(tech => (
                          <span key={tech} className="px-3 py-1 rounded-full text-xs bg-black/5 border border-[var(--border)] text-[var(--foreground)]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {(selectedProject.liveUrl || selectedProject.repoUrl) && (
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border)]">
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--gold)] text-white font-semibold text-sm hover:bg-[var(--gold-hover)] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                      {selectedProject.repoUrl && (
                        <a
                          href={selectedProject.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg glass text-[var(--foreground)] font-semibold text-sm hover:bg-white/10 transition-colors"
                        >
                          <Code2 className="w-4 h-4" />
                          Source Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
