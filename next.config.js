/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许外部图片
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // API 路由最大超时（Vercel 免费版最长 60s，Pro 版 300s）
  experimental: {
    serverComponentsExternalPackages: ['mammoth'],
  },
};

module.exports = nextConfig;
