/**
 * Next.js 中间件 - 保护管理端 API 路由
 *
 * /admin 页面不需要中间件保护（页面自带登录表单组件）
 * 只需要保护 /api/admin/* 接口（防止未认证调用）
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'admin_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只保护管理端 API 路由
  if (!pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // 登录和认证检查 API 不需要验证
  if (pathname === '/api/admin/login' || pathname === '/api/admin/auth') {
    return NextResponse.next();
  }

  // 检查认证 Cookie
  const authToken = request.cookies.get(AUTH_COOKIE)?.value;
  if (!authToken) {
    return NextResponse.json(
      { error: '未授权访问' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
