'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RESUME_DATA } from '@/lib/config';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Edu' },
  { id: 'experience', label: 'Exp' },
  { id: 'projects', label: 'Proj' },
  { id: 'skills', label: 'Skill' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);

      // 确定当前活跃的 section
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-40"
        >
          <div className="bg-surface/90 backdrop-blur-xl border-b border-surface-700/20">
            <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
              <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 text-sm font-semibold text-white hover:text-surface-400 transition-colors">
                <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black text-xs font-bold">{RESUME_DATA.name[0]}</div>
                <span className="hidden sm:inline tracking-wide">{RESUME_DATA.name}</span>
              </button>

              {/* 导航链接 */}
              <div className="flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`relative px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-white/10 rounded-lg"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
