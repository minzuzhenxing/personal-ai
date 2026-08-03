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
            <span className="text-sm font-mono text-primary-400 tracking-wider uppercase">Skills</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">技能特长</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full" />
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESUME_DATA.skills.map((group, idx) => (
              <StaggerItem key={idx}>
                <div className="glass-card p-6 h-full">
                  {/* 分类标题 */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${group.color}`} />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                      {group.category}
                    </h3>
                  </div>

                  {/* 技能条 */}
                  <div className="space-y-4">
                    {group.items.map((skill, i) => (
                      <SkillBar
                        key={i}
                        name={skill.name}
                        level={skill.level}
                        colorClass={group.color}
                        delay={idx * 0.2 + i * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </ScrollReveal>

        {/* 证书 */}
        <ScrollReveal delay={0.3} className="mt-8">
          <div className="glass-card p-5 flex items-center gap-4 max-w-md mx-auto">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
              📜
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">荣誉证书</h4>
              <p className="text-xs text-gray-400">英语四级（CET-4）· 听说读写能力良好</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
