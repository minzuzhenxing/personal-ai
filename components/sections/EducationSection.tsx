'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import { RESUME_DATA } from '@/lib/config';

export default function EducationSection() {
  const [expanded, setExpanded] = useState(false);
  const edu = RESUME_DATA.education[0];

  return (
    <section id="education" className="relative py-24 sm:py-32 px-4">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-surface-700/30 to-transparent" />

      <div className="max-w-4xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-surface-500 tracking-[0.2em] uppercase">Education</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">教育背景</h2>
            <div className="w-10 h-px bg-white/20 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <motion.div layout className="relative glass-card p-6 sm:p-8 cursor-pointer group" onClick={() => setExpanded(!expanded)}>
            <div className="absolute -left-2.5 top-8 w-5 h-5 rounded-full bg-white border-4 border-surface flex items-center justify-center" />

            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-surface-300 transition-colors">{edu.school}</h3>
                <p className="text-surface-400 font-medium">{edu.major} · {edu.degree}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-3 py-1 rounded-full bg-surface-700/50 border border-surface-600/30 text-xs text-surface-400 font-mono">{edu.period}</span>
                <motion.svg animate={{ rotate: expanded ? 180 : 0 }} className="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>
            </div>

            <p className="text-surface-400 text-sm leading-relaxed">{edu.highlights}</p>

            <AnimatePresence>
              {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="mt-6 pt-6 border-t border-surface-700/30">
                    <h4 className="text-xs font-semibold text-surface-400 mb-3 tracking-wide">主修课程</h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.courses.map((course, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-surface-700/30 border border-surface-600/20 text-xs text-surface-300">{course}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="right" className="mt-6">
          <div className="glass-card p-5 ml-8 relative">
            <div className="absolute -left-2.5 top-5 w-5 h-5 rounded-full bg-surface-500 border-4 border-surface flex items-center justify-center" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-base opacity-60">🏫</span>
              <h4 className="font-semibold text-white text-sm">{RESUME_DATA.campus.role}</h4>
            </div>
            <span className="text-[11px] text-surface-500 font-mono mb-2 block">{RESUME_DATA.campus.period}</span>
            <p className="text-sm text-surface-400 leading-relaxed">{RESUME_DATA.campus.description}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
