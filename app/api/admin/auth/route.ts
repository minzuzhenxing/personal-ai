/**
 * 管理端认证检查 API
 * GET /api/admin/auth
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const hasAuth = cookieHeader.includes('admin_auth=true');

  if (hasAuth) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
