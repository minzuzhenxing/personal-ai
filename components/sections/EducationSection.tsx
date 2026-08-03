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
      {/* 装饰背景线 */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-800/60 to-transparent" />

      <div className="max-w-4xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-primary-400 tracking-wider uppercase">Education</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">教育背景</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full" />
          </div>
        </ScrollReveal>

        {/* 时间线卡片 */}
        <ScrollReveal direction="left">
          <motion.div
            layout
            className="relative glass-card p-6 sm:p-8 cursor-pointer group"
            onClick={() => setExpanded(!expanded)}
          >
            {/* 时间线节点 */}
            <div className="absolute -left-3 top-8 w-6 h-6 rounded-full bg-primary-500 border-4 border-gray-950 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            {/* 头部 */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                  {edu.school}
                </h3>
                <p className="text-primary-400 font-medium">{edu.major} · {edu.degree}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-xs text-primary-300 font-mono">
                  {edu.period}
                </span>
                <motion.svg
                  animate={{ rotate: expanded ? 180 : 0 }}
                  className="w-5 h-5 text-gray-400"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>
            </div>

            {/* 摘要 */}
            <p className="text-gray-400 text-sm leading-relaxed">{edu.highlights}</p>

            {/* 展开详情 */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-gray-800/60">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">📚 主修课程</h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.courses.map((course, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg bg-gray-800/60 border border-gray-700/40 text-xs text-gray-300"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </ScrollReveal>

        {/* 校园经历小卡片 */}
        <ScrollReveal delay={0.2} direction="right" className="mt-6">
          <div className="glass-card p-5 ml-8 relative">
            <div className="absolute -left-3 top-5 w-6 h-6 rounded-full bg-accent-500 border-4 border-gray-950 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">🏫</span>
              <h4 className="font-semibold text-white">{RESUME_DATA.campus.role}</h4>
            </div>
            <span className="text-xs text-gray-500 font-mono mb-2 block">{RESUME_DATA.campus.period}</span>
            <p className="text-sm text-gray-400 leading-relaxed">{RESUME_DATA.campus.description}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
