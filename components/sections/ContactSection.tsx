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
            <span className="text-sm font-mono text-primary-400 tracking-wider uppercase">Contact</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">联系我</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full" />
            <p className="text-gray-400 mt-4">期待与你交流，共同探索技术的可能性</p>
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 邮箱 */}
            <StaggerItem>
              <motion.a
                href={`mailto:${RESUME_DATA.email}`}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card p-6 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center group-hover:border-primary-500/60 transition-colors">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">邮箱</p>
                  <p className="text-sm text-gray-200 group-hover:text-primary-400 transition-colors">{RESUME_DATA.email}</p>
                </div>
              </motion.a>
            </StaggerItem>

            {/* 电话 */}
            <StaggerItem>
              <motion.a
                href={`tel:${RESUME_DATA.phone}`}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card p-6 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/30 flex items-center justify-center group-hover:border-accent-500/60 transition-colors">
                  <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">电话</p>
                  <p className="text-sm text-gray-200 group-hover:text-accent-400 transition-colors">{RESUME_DATA.phone}</p>
                </div>
              </motion.a>
            </StaggerItem>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.3} className="mt-10 text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block"
          >
            <a
              href={`mailto:${RESUME_DATA.email}?subject=Hi ${RESUME_DATA.name}，我想和你聊聊`}
              className="btn-primary text-base px-8 py-4"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              发送邮件联系我
            </a>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
