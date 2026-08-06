/**
 * 诊断 API - 检查 Redis 连接状态和记忆存储情况
 * GET /api/status
 */

import { NextResponse } from 'next/server';
import { REDIS_CONFIG } from '@/lib/config';
import { getRedis } from '@/lib/redis';
import { getAllMemories, getMemoryCount } from '@/lib/memory/store';

export async function GET() {
  try {
    // 1. Redis 配置状态
    const configStatus = {
      mode: REDIS_CONFIG.mode,
      hasKVUrl: !!REDIS_CONFIG.kvRestUrl,
      hasKVToken: !!REDIS_CONFIG.kvRestToken,
      hasRedisUrl: !!REDIS_CONFIG.url,
    };

    // 2. 测试 Redis 连接和基本操作
    let redisStatus = 'unknown';
    try {
      const redis = await getRedis();
      const testKey = '__status_test__';
      await redis.set(testKey, 'ok', { ex: 60 });
      const readBack = await redis.get(testKey);
      redisStatus = readBack === 'ok' ? '读写正常' : '读取异常';
    } catch (e) {
      redisStatus = `连接失败: ${(e as Error).message}`;
    }

    // 3. 记忆存储情况
    let memoryCount = -1;
    try {
      memoryCount = await getMemoryCount();
    } catch (e) {
      memoryCount = -1;
    }

    // 4. 列出最近的记忆（最多 3 条）
    let recentMemories: string[] = [];
    try {
      const all = await getAllMemories();
      recentMemories = all.slice(0, 3).map((m) => `${m.category}: ${m.content.slice(0, 60)}...`);
    } catch {
      recentMemories = ['获取失败'];
    }

    return NextResponse.json({
      config: configStatus,
      redis: redisStatus,
      memoryCount,
      recentMemories,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
