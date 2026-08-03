import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '张子平 | 后端开发 & AI 工程师',
  description: '东北大学软件工程在读本科生，专注 Java 后端开发与 AI 智能化方向，拥有东软医疗实习经历和多个商业级项目实战经验。',
  keywords: ['张子平', '后端开发', 'AI 工程师', 'Java', 'SpringBoot', 'SpringAI', '东北大学', '软件工程', '简历', '求职'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="min-h-screen bg-gray-950">
        {/* 全局背景装饰 */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-500/4 to-accent-500/4 rounded-full blur-3xl" />
        </div>

        {children}
      </body>
    </html>
  );
}
