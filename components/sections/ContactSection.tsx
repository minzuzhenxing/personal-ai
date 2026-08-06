'use client';

import { motion } from 'framer-motion';
import ScrollReveal, { StaggerItem } from '../ui/ScrollReveal';
import { RESUME_DATA } from '@/lib/config';

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-surface-500 tracking-[0.2em] uppercase">Contact</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">联系我</h2>
            <div className="w-10 h-px bg-white/20 mx-auto mt-6" />
            <p className="text-surface-500 mt-4 text-sm">期待与你交流，共同探索技术的可能性</p>
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: '邮箱', value: RESUME_DATA.email, icon: '✉️', href: `mailto:${RESUME_DATA.email}` },
              { label: '电话', value: RESUME_DATA.phone, icon: '📞', href: `tel:${RESUME_DATA.phone}` },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <motion.a href={item.href} whileHover={{ y: -2 }} className="glass-card p-6 flex items-center gap-4 group transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-surface-700 border border-surface-600/30 flex items-center justify-center text-base opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</div>
                  <div>
                    <p className="text-[11px] text-surface-500 tracking-wider">{item.label}</p>
                    <p className="text-sm text-surface-300 group-hover:text-white transition-colors">{item.value}</p>
                  </div>
                </motion.a>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="mt-10 text-center">
          <motion.div whileHover={{ scale: 1.01 }} className="inline-block">
            <a href={`mailto:${RESUME_DATA.email}?subject=Hi ${RESUME_DATA.name}`} className="btn-primary text-base px-8 py-4 tracking-wide">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              发送邮件联系我
            </a>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
