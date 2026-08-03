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
            <span className="text-sm font-mono text-primary-400 tracking-wider uppercase">Projects</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">项目经验</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full" />
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {RESUME_DATA.projects.map((project, idx) => (
              <StaggerItem key={idx}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass-card overflow-hidden cursor-pointer group h-full flex flex-col"
                  onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                >
                  {/* 渐变色顶部条 */}
                  <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* 角色标签 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white`}>
                        {project.role}
                      </span>
                    </div>

                    {/* 项目名 */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                      {project.name}
                    </h3>

                    {/* 描述 */}
                    <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>

                    {/* 技术栈标签 */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-800/80 border border-gray-700/40 text-[11px] text-cyan-300 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* 展开/收起 */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary-400/60">
                        {expandedId === idx ? '收起详情' : '点击展开 →'}
                      </span>
                      <motion.svg
                        animate={{ rotate: expandedId === idx ? 180 : 0 }}
                        className="w-4 h-4 text-gray-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>

                    {/* 展开详情 */}
                    <AnimatePresence>
                      {expandedId === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-gray-800/60 space-y-2.5">
                            {project.details.map((detail, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex gap-2"
                              >
                                <span className="text-primary-400 mt-0.5 flex-shrink-0">▸</span>
                                <p className="text-xs text-gray-300 leading-relaxed">{detail}</p>
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
