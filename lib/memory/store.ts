/**
 * 长期记忆存储层 - 基于 Redis（支持阿里云/腾讯云等国内 Redis）
 *
 * 存储结构:
 *   memories (Hash):        id → Memory JSON
 *   memory_index (SortedSet): score=createdAt timestamp, value=id
 *
 * 未配置 Redis 时自动使用本地内存模式（开发用，重启数据丢失）
 */

import { getRedis } from '../redis';
import { REDIS_KEYS } from '../config';
import type { Memory, CreateMemoryInput, MemoryRetrievalResult } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 获取所有记忆
 */
export async function getAllMemories(): Promise<Memory[]> {
  const redis = await getRedis();
  const all = await redis.hgetall(REDIS_KEYS.memories);
  if (!all) return [];

  return Object.values(all)
    .map((v) => {
      try {
        return JSON.parse(v as string) as Memory;
      } catch {
        return null;
      }
    })
    .filter((m): m is Memory => m !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 根据 ID 获取单条记忆
 */
export async function getMemory(id: string): Promise<Memory | null> {
  const redis = await getRedis();
  const raw = await redis.hget(REDIS_KEYS.memories, id);
  if (!raw) return null;
  try {
    return JSON.parse(raw as string) as Memory;
  } catch {
    return null;
  }
}

/**
 * 创建新记忆
 */
export async function createMemory(input: CreateMemoryInput): Promise<Memory> {
  const redis = await getRedis();
  const now = new Date().toISOString();
  const memory: Memory = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  await redis.hset(REDIS_KEYS.memories, {
    [memory.id]: JSON.stringify(memory),
  });
  await redis.zadd(REDIS_KEYS.memoryIndex, {
    score: Date.now(),
    member: memory.id,
  });

  return memory;
}

/**
 * 批量创建记忆
 */
export async function createMemoriesBatch(
  inputs: CreateMemoryInput[]
): Promise<Memory[]> {
  const memories = await Promise.all(inputs.map((input) => createMemory(input)));
  return memories;
}

/**
 * 更新记忆
 */
export async function updateMemory(
  id: string,
  input: Partial<CreateMemoryInput>
): Promise<Memory | null> {
  const existing = await getMemory(id);
  if (!existing) return null;

  const updated: Memory = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  const redis = await getRedis();
  await redis.hset(REDIS_KEYS.memories, {
    [id]: JSON.stringify(updated),
  });

  return updated;
}

/**
 * 删除记忆
 */
export async function deleteMemory(id: string): Promise<boolean> {
  const redis = await getRedis();
  const exists = await redis.hexists(REDIS_KEYS.memories, id);
  if (!exists) return false;

  await redis.hdel(REDIS_KEYS.memories, id);
  await redis.zrem(REDIS_KEYS.memoryIndex, id);
  return true;
}

/**
 * 根据分类获取记忆
 */
export async function getMemoriesByCategory(
  category: string
): Promise<Memory[]> {
  const all = await getAllMemories();
  return all.filter((m) => m.category === category);
}

/**
 * 搜索记忆（中文感知的 n-gram 匹配）
 *
 * 中文没有空格分词，简单的 split 会把整句变成一个"词"导致匹配失败。
 * 这里使用二元组（bigram）重叠 + 单字重叠 + 子串匹配的混合评分，
 * 对中文查询有良好的召回效果。
 */
export async function searchMemories(query: string): Promise<MemoryRetrievalResult[]> {
  const all = await getAllMemories();
  if (all.length === 0) return [];

  // 规范化：去空格、转小写
  const queryClean = query.toLowerCase().replace(/\s+/g, '');
  const queryBigrams = getBigrams(queryClean);
  const queryChars = new Set(queryClean.split(''));

  const results: MemoryRetrievalResult[] = all.map((memory) => {
    const contentClean = memory.content.toLowerCase().replace(/\s+/g, '');
    const contentBigrams = getBigrams(contentClean);
    const contentChars = new Set(contentClean.split(''));
    const tagsLower = memory.tags.map((t) => t.toLowerCase());

    let score = 0;

    // 1. 精确子串匹配（最强信号）
    if (queryClean.length > 0 && contentClean.includes(queryClean)) {
      score += 10;
    }
    if (queryClean.length > 1 && queryClean.includes(contentClean)) {
      score += 8;
    }

    // 2. 二元组重叠（中文核心匹配信号）
    queryBigrams.forEach((bg) => {
      if (contentBigrams.has(bg)) score += 2;
    });

    // 3. 单字重叠（短查询兜底）
    if (queryClean.length > 1) {
      let charHits = 0;
      queryChars.forEach((c) => {
        if (contentChars.has(c)) charHits++;
      });
      score += charHits * 0.25;
    }

    // 4. 标签匹配
    if (tagsLower.some((t) => queryClean.includes(t) || t.includes(queryClean))) {
      score += 3;
    }

    // 5. 重要性加权
    score *= (0.6 + memory.importance * 0.4);

    return { memory, relevanceScore: score };
  });

  // 过滤掉完全不相关的，按分数降序排列
  return results
    .filter((r) => r.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * 提取字符串的二元组集合（用于中文相似度匹配）
 */
function getBigrams(text: string): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i < text.length - 1; i++) {
    set.add(text.slice(i, i + 2));
  }
  return set;
}

/**
 * 获取记忆总数
 */
export async function getMemoryCount(): Promise<number> {
  const redis = await getRedis();
  return await redis.hlen(REDIS_KEYS.memories);
}

/**
 * 清空所有记忆（谨慎使用）
 */
export async function clearAllMemories(): Promise<void> {
  const redis = await getRedis();
  await redis.del(REDIS_KEYS.memories, REDIS_KEYS.memoryIndex);
}
