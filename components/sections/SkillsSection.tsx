'use client';

import ScrollReveal, { StaggerItem } from '../ui/ScrollReveal';
import SkillBar from '../ui/SkillBar';
import { RESUME_DATA } from '@/lib/config';

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-surface-500 tracking-[0.2em] uppercase">Skills</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">技能特长</h2>
            <div className="w-10 h-px bg-white/20 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {RESUME_DATA.skills.map((group, idx) => (
              <StaggerItem key={idx}>
                <div className="glass-card p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    <h3 className="text-xs font-semibold text-white uppercase tracking-[0.15em]">{group.category}</h3>
                  </div>
                  <div className="space-y-5">
                    {group.items.map((skill, i) => (
                      <SkillBar key={i} name={skill.name} level={skill.level} delay={idx * 0.2 + i * 0.1} />
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="mt-8">
          <div className="glass-card p-5 flex items-center gap-4 max-w-md mx-auto">
            <div className="w-8 h-8 rounded-lg bg-surface-700 border border-surface-600/30 flex items-center justify-center text-sm">📜</div>
            <div>
              <h4 className="text-sm font-semibold text-white">荣誉证书</h4>
              <p className="text-xs text-surface-500">英语四级（CET-4）· 听说读写能力良好</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
