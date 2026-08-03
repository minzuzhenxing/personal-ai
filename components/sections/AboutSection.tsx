'use client';

import { motion } from 'framer-motion';
import ScrollReveal, { StaggerItem } from '../ui/ScrollReveal';
import { RESUME_DATA } from '@/lib/config';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section 标题 */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-primary-400 tracking-wider uppercase">About Me</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">关于我</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full" />
          </div>
        </ScrollReveal>

        {/* 自我介绍 */}
        <ScrollReveal className="mb-16">
          <div className="glass-card p-8 max-w-2xl mx-auto text-center">
            <p className="text-gray-300 leading-relaxed text-lg">
              {RESUME_DATA.selfEvaluation}
            </p>
          </div>
        </ScrollReveal>

        {/* 统计卡片网格 */}
        <ScrollReveal stagger={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {RESUME_DATA.stats.map((stat, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-card p-6 text-center group cursor-default"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                    {stat.value}
                    <span className="text-lg font-medium text-primary-300">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1.5">{stat.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
