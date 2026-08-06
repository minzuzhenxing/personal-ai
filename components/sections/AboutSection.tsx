'use client';

import { motion } from 'framer-motion';
import ScrollReveal, { StaggerItem } from '../ui/ScrollReveal';
import { RESUME_DATA } from '@/lib/config';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-surface-500 tracking-[0.2em] uppercase">About</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">关于我</h2>
            <div className="w-10 h-px bg-white/20 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-16">
          <div className="glass-card p-8 max-w-2xl mx-auto text-center">
            <p className="text-surface-300 leading-relaxed text-base">{RESUME_DATA.selfEvaluation}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {RESUME_DATA.stats.map((stat, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="glass-card p-6 text-center group cursor-default transition-all duration-300"
                >
                  <div className="text-2xl mb-2 opacity-60">{stat.icon}</div>
                  <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {stat.value}
                    <span className="text-lg font-light text-surface-500">{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-surface-500 mt-2 tracking-wide">{stat.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
