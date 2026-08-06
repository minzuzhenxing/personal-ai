'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import { RESUME_DATA } from '@/lib/config';

export default function ExperienceSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section id="experience" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-surface-500 tracking-[0.2em] uppercase">Experience</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">实习经历</h2>
            <div className="w-10 h-px bg-white/20 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {RESUME_DATA.experience.map((exp, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.15}>
              <motion.div layout className="glass-card overflow-hidden cursor-pointer group" onClick={() => setExpandedId(expandedId === idx ? null : idx)}>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-700 border border-surface-600/30 flex items-center justify-center text-lg">🏥</div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-surface-300 transition-colors">{exp.company}</h3>
                        <p className="text-surface-400 font-medium text-sm">{exp.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="px-3 py-1 rounded-full bg-surface-700/50 border border-surface-600/30 text-xs text-surface-400 font-mono">{exp.period}</span>
                      <motion.svg animate={{ rotate: expandedId === idx ? 180 : 0 }} className="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded text-[11px] bg-surface-700/50 text-surface-300 border border-surface-600/20 mb-3">项目: {exp.project}</span>
                  <p className="text-surface-400 text-sm leading-relaxed">{exp.summary}</p>
                  {expandedId !== idx && <p className="text-xs text-surface-600 mt-3">点击展开详情 →</p>}
                </div>

                <AnimatePresence>
                  {expandedId === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <div className="border-t border-surface-700/30 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {exp.details.map((detail, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-4 rounded-xl bg-surface-700/20 border border-surface-700/30 hover:border-surface-500/30 transition-colors">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-base">{detail.icon}</span>
                                <h4 className="text-sm font-semibold text-white">{detail.title}</h4>
                              </div>
                              <p className="text-xs text-surface-400 leading-relaxed">{detail.desc}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
