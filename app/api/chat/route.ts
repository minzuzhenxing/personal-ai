/**
 * 公开问答 API
 * POST /api/chat
 *
 * 供网站访问者使用，AI 以你的身份回答问题
 */

import { NextResponse } from 'next/server';
import { handlePublicQuery } from '@/lib/chains/public-chain';
import { getRedis } from '@/lib/redis';
import { REDIS_KEYS } from '@/lib/config';
import type { ConversationMessage } from '@/lib/memory/types';

export async function POST(request: Request) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '请输入有效的消息' },
        { status: 400 }
      );
    }

    // 从 Redis 获取当前会话的短期记忆
    const redis = await getRedis();
    const sessionKey = `session:${sessionId || 'public'}`;
    const rawHistory = await redis.get(sessionKey);
    const history: ConversationMessage[] = rawHistory
      ? JSON.parse(rawHistory as string)
      : [];

    // 调用公开问答链
    const answer = await handlePublicQuery(message, history);

    // 更新会话历史
    const updatedHistory: ConversationMessage[] = [
      ...history,
      {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        role: 'assistant',
        content: answer,
        timestamp: new Date().toISOString(),
      },
    ];

    // 只保留最近 30 条消息
    const trimmedHistory = updatedHistory.slice(-30);
    await redis.set(sessionKey, JSON.stringify(trimmedHistory), { ex: 3600 }); // 1 小时过期

    return NextResponse.json({
      success: true,
      message: answer,
    });
  } catch (error) {
    console.error('公开问答 API 出错:', error);
    return NextResponse.json(
      { error: '处理消息时出错，请稍后再试' },
      { status: 500 }
    );
  }
}
