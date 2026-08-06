'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AIAvatar from '../ui/AIAvatar';
import { RESUME_DATA } from '@/lib/config';

const ParticleCanvas = dynamic(() => import('../ui/ParticleCanvas'), { ssr: false });

function TypingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    const speed = isDeleting ? 40 : 80;
    if (!isDeleting && displayed === current) {
      const timer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timer);
    }
    if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index, texts]);

  return (
    <span className="text-base sm:text-lg text-surface-400 font-light tracking-wide">
      {displayed}
      <span className="inline-block w-px h-4 bg-surface-500 ml-1 animate-typewriter" />
    </span>
  );
}

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />

      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-white/3 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-white/2 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <AIAvatar size={160} className="mb-8" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-7xl font-bold mb-4 text-white tracking-tight"
        >
          {RESUME_DATA.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-lg text-surface-400 mb-2 font-light tracking-wide"
        >
          {RESUME_DATA.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="h-8 mb-10"
        >
          <TypingText texts={RESUME_DATA.heroDescriptions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex gap-4"
        >
          <a href="#about" className="btn-primary text-sm tracking-wide">
            了解更多
          </a>
          <a href="#contact" className="btn-ghost text-sm tracking-wide">
            联系我
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[11px] text-surface-500 tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-surface-600 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-white/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
