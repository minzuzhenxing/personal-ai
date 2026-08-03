/**
 * 管理端登录 API
 * POST /api/admin/login
 */

import { NextResponse } from 'next/server';
import { ADMIN_CONFIG } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: '请输入密码' },
        { status: 400 }
      );
    }

    if (password !== ADMIN_CONFIG.password) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 设置认证 Cookie（24 小时有效）
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
    });

    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 小时
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('登录 API 出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
