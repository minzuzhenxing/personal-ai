import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '管理端 - 记忆构建 | AI Personal Assistant',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
