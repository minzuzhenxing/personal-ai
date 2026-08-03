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
            <span className="text-sm font-mono text-primary-400 tracking-wider uppercase">Experience</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">实习经历</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full" />
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {RESUME_DATA.experience.map((exp, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.15}>
              <motion.div
                layout
                className="glass-card overflow-hidden cursor-pointer group"
                onClick={() => setExpandedId(expandedId === idx ? null : idx)}
              >
                {/* 头部 - 始终可见 */}
                <div className="p-6 sm:p-8">
                  {/* 顶部信息栏 */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center text-xl">
                        🏥
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                          {exp.company}
                        </h3>
                        <p className="text-primary-400 font-medium">{exp.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-xs text-primary-300 font-mono">
                        {exp.period}
                      </span>
                      <motion.svg
                        animate={{ rotate: expandedId === idx ? 180 : 0 }}
                        className="w-5 h-5 text-gray-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </div>

                  {/* 项目名 + 摘要 */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-gray-800/60 text-gray-300 border border-gray-700/40">
                      项目: {exp.project}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{exp.summary}</p>

                  {/* 展开提示 */}
                  {expandedId !== idx && (
                    <p className="text-xs text-primary-400/60 mt-3">点击展开详情 →</p>
                  )}
                </div>

                {/* 展开详情 */}
                <AnimatePresence>
                  {expandedId === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <div className="border-t border-gray-800/60 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {exp.details.map((detail, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-primary-500/30 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{detail.icon}</span>
                                <h4 className="text-sm font-semibold text-white">{detail.title}</h4>
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed">{detail.desc}</p>
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
