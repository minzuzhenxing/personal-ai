/**
 * 管理端对话 API
 * POST /api/admin/chat
 *
 * 只有你本人使用的记忆构建对话
 * AI 会通过自然对话了解你，并自动提取和存储记忆
 */

import { NextResponse } from 'next/server';
import { handleAdminChat } from '@/lib/chains/admin-chain';
import { getRedis } from '@/lib/redis';
import type { ConversationMessage } from '@/lib/memory/types';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '请输入有效的消息' },
        { status: 400 }
      );
    }

    // 从 Redis 获取管理端对话历史
    const redis = await getRedis();
    const sessionKey = 'admin:session';
    const rawHistory = await redis.get(sessionKey);
    const history: ConversationMessage[] = rawHistory
      ? JSON.parse(rawHistory as string)
      : [];

    // 调用管理端对话链
    const { reply, newMemories } = await handleAdminChat(message, history);

    // 更新对话历史
    const updatedHistory: ConversationMessage[] = [
      ...history,
      {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      },
    ];

    // 保留最近 50 条消息（管理端对话更长）
    const trimmedHistory = updatedHistory.slice(-50);
    await redis.set(sessionKey, JSON.stringify(trimmedHistory), { ex: 86400 }); // 24 小时过期

    return NextResponse.json({
      success: true,
      message: reply,
      newMemories,
    });
  } catch (error) {
    console.error('管理端对话 API 出错:', error);
    return NextResponse.json(
      { error: '处理消息时出错，请稍后再试' },
      { status: 500 }
    );
  }
}

/**
 * 获取管理端对话历史
 */
export async function GET() {
  try {
    const redis = await getRedis();
    const rawHistory = await redis.get('admin:session');
    const history: ConversationMessage[] = rawHistory
      ? JSON.parse(rawHistory as string)
      : [];

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('获取对话历史出错:', error);
    return NextResponse.json(
      { error: '获取对话历史失败' },
      { status: 500 }
    );
  }
}
