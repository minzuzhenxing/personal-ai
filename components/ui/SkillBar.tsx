'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SkillBarProps {
  name: string;
  level: number;
  delay?: number;
}

export default function SkillBar({ name, level, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{name}</span>
        <span className="text-xs text-gray-500 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-surface-700/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white/80 rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}
