'use client';

import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import EducationSection from '@/components/sections/EducationSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ContactSection from '@/components/sections/ContactSection';
import Navbar from '@/components/Navbar';

// 懒加载 - 减少初始包体积
const ChatBubble = dynamic(() => import('@/components/ui/ChatBubble'), { ssr: false });

export default function Home() {
  return (
    <>
      {/* 固定导航栏 */}
      <Navbar />

      {/* 主内容 - 叙事长页 */}
      <main>
        <HeroSection />

        {/* Section 分隔装饰 */}
        <div className="section-divider" />

        <AboutSection />
        <div className="section-divider" />

        <EducationSection />
        <div className="section-divider" />

        <ExperienceSection />
        <div className="section-divider" />

        <ProjectsSection />
        <div className="section-divider" />

        <SkillsSection />
        <div className="section-divider" />

        <ContactSection />
      </main>

      {/* 底部 */}
      <footer className="py-8 border-t border-gray-800/40 text-center">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} 张子平 · 基于 AI 驱动的个人展示网站
        </p>
        <p className="text-[10px] text-gray-700 mt-1">
          Powered by Next.js + 通义千问 · 右下角 AI 气泡可随时对话
        </p>
      </footer>

      {/* AI 对话浮动气泡 */}
      <ChatBubble />
    </>
  );
}
