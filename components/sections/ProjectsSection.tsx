'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal, { StaggerItem } from '../ui/ScrollReveal';
import { RESUME_DATA } from '@/lib/config';

export default function ProjectsSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section id="projects" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-surface-500 tracking-[0.2em] uppercase">Projects</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">项目经验</h2>
            <div className="w-10 h-px bg-white/20 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {RESUME_DATA.projects.map((project, idx) => (
              <StaggerItem key={idx}>
                <motion.div whileHover={{ y: -2 }} className="glass-card overflow-hidden cursor-pointer group h-full flex flex-col" onClick={() => setExpandedId(expandedId === idx ? null : idx)}>
                  <div className="h-0.5 bg-white/10" />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-surface-200">{project.role}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-surface-300 transition-colors">{project.name}</h3>
                    <p className="text-sm text-surface-400 leading-relaxed mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-surface-700/40 border border-surface-600/20 text-[11px] text-surface-400 font-mono">{tech}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-surface-600">{expandedId === idx ? '收起详情' : '点击展开 →'}</span>
                      <motion.svg animate={{ rotate: expandedId === idx ? 180 : 0 }} className="w-3.5 h-3.5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                    <AnimatePresence>
                      {expandedId === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="mt-4 pt-4 border-t border-surface-700/30 space-y-2.5">
                            {project.details.map((detail, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex gap-2">
                                <span className="text-surface-500 mt-0.5 flex-shrink-0 text-xs">▸</span>
                                <p className="text-xs text-surface-300 leading-relaxed">{detail}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
