/**
 * Redis 客户端 — 三种模式自适应
 *
 * 1. vercel-kv: Vercel 自动注入 KV_REST_API_URL + KV_REST_API_TOKEN → @upstash/redis REST API
 * 2. redis:     REDIS_URL 已配置 → ioredis 标准 TCP 连接
 * 3. memory:    以上均未配置 → 本地内存（开发用，重启丢失）
 */

import { REDIS_CONFIG } from './config';

// ==================== 统一接口 ====================
export interface IRedisStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, opts?: { ex?: number }): Promise<string | null>;
  hgetall(key: string): Promise<Record<string, string> | null>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, kv: Record<string, string>): Promise<number>;
  hdel(key: string, ...fields: string[]): Promise<number>;
  hexists(key: string, field: string): Promise<number>;
  hlen(key: string): Promise<number>;
  zadd(key: string, ...scoreMembers: Array<{ score: number; member: string }>): Promise<number>;
  zrem(key: string, ...members: string[]): Promise<number>;
  del(...keys: string[]): Promise<number>;
}

// ==================== 内存模式 ====================
class MemoryStore implements IRedisStore {
  private data = new Map<string, any>();
  private expirations = new Map<string, number>();

  private isExpired(key: string): boolean {
    const exp = this.expirations.get(key);
    if (exp && Date.now() > exp) {
      this.data.delete(key);
      this.expirations.delete(key);
      return true;
    }
    return false;
  }

  async get(key: string) {
    if (this.isExpired(key)) return null;
    return this.data.get(key) ?? null;
  }

  async set(key: string, value: string, opts?: { ex?: number }) {
    this.data.set(key, value);
    if (opts?.ex) this.expirations.set(key, Date.now() + opts.ex * 1000);
    return 'OK';
  }

  async hgetall(key: string) {
    if (this.isExpired(key)) return null;
    return this.data.get(`hash:${key}`) ?? null;
  }

  async hget(key: string, field: string) {
    const hash = await this.hgetall(key);
    return hash?.[field] ?? null;
  }

  async hset(key: string, kv: Record<string, string>) {
    let existing = this.data.get(`hash:${key}`) || {};
    if (typeof existing !== 'object' || Array.isArray(existing)) existing = {};
    Object.assign(existing, kv);
    this.data.set(`hash:${key}`, existing);
    return Object.keys(kv).length;
  }

  async hdel(key: string, ...fields: string[]) {
    const hash = this.data.get(`hash:${key}`);
    if (!hash || typeof hash !== 'object') return 0;
    let count = 0;
    for (const f of fields) { if (f in hash) { delete hash[f]; count++; } }
    this.data.set(`hash:${key}`, hash);
    return count;
  }

  async hexists(key: string, field: string) {
    const hash = await this.hgetall(key);
    return hash && field in hash ? 1 : 0;
  }

  async hlen(key: string) {
    const hash = await this.hgetall(key);
    return hash ? Object.keys(hash).length : 0;
  }

  async zadd(key: string, ...scoreMembers: Array<{ score: number; member: string }>) {
    let zset = this.data.get(`zset:${key}`);
    if (!zset) { zset = new Map<string, number>(); this.data.set(`zset:${key}`, zset); }
    let added = 0;
    for (const { score, member } of scoreMembers) {
      if (!zset.has(member)) added++;
      zset.set(member, score);
    }
    return added;
  }

  async zrem(key: string, ...members: string[]) {
    const zset = this.data.get(`zset:${key}`);
    if (!zset) return 0;
    let count = 0;
    for (const m of members) { if (zset.delete(m)) count++; }
    return count;
  }

  async del(...keys: string[]) {
    let count = 0;
    for (const key of keys) {
      if (this.data.delete(key)) count++;
      if (this.data.delete(`hash:${key}`)) count++;
      if (this.data.delete(`zset:${key}`)) count++;
    }
    return count;
  }
}

// ==================== Upstash REST 模式 (Vercel KV) ====================
async function createUpstashStore(): Promise<IRedisStore> {
  const { Redis } = await import('@upstash/redis');

  const client = new Redis({
    url: REDIS_CONFIG.kvRestUrl,
    token: REDIS_CONFIG.kvRestToken,
    enableAutoPipelining: false,
  });

  console.log('[Redis] Upstash REST (Vercel KV) 已初始化');
  // 不做 ping 验证：serverless 冷启动时额外网络请求可能超时

  return {
    async get(key: string) { return await client.get(key); },
    async set(key: string, value: string, opts?: { ex?: number }) {
      const result = opts?.ex
        ? await client.set(key, value, { ex: opts.ex })
        : await client.set(key, value);
      return result ?? null;
    },
    async hgetall(key: string) { return await client.hgetall(key); },
    async hget(key: string, field: string) { return await client.hget(key, field); },
    async hset(key: string, kv: Record<string, string>) {
      // Upstash hset 支持直接传对象
      return await client.hset(key, kv as Record<string, unknown>);
    },
    async hdel(key: string, ...fields: string[]) {
      return await client.hdel(key, ...fields);
    },
    async hexists(key: string, field: string) {
      return (await client.hexists(key, field)) ? 1 : 0;
    },
    async hlen(key: string) { return await client.hlen(key); },
    async zadd(key: string, ...scoreMembers: Array<{ score: number; member: string }>) {
      let added = 0;
      for (const sm of scoreMembers) {
        const result = await client.zadd(key, { score: sm.score, member: sm.member });
        if (result !== null && result !== undefined) added++;
      }
      return added;
    },
    async zrem(key: string, ...members: string[]) {
      return await client.zrem(key, ...members);
    },
    async del(...keys: string[]) { return await client.del(...keys); },
  };
}

// ==================== ioredis 模式（标准 Redis）====================
async function createIORedisStore(): Promise<IRedisStore> {
  const { default: RedisClient } = await import('ioredis');

  const redis = REDIS_CONFIG.url
    ? new RedisClient(REDIS_CONFIG.url, {
        maxRetriesPerRequest: 3,
        retryStrategy(times: number) {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      })
    : new RedisClient({
        host: REDIS_CONFIG.host || '127.0.0.1',
        port: REDIS_CONFIG.port,
        password: REDIS_CONFIG.password || undefined,
        maxRetriesPerRequest: 3,
        retryStrategy(times: number) {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });

  try {
    await redis.connect();
    console.log('[Redis] ioredis (标准 Redis) 已连接');
  } catch (err) {
    console.warn('[Redis] ioredis 连接失败:', (err as Error).message);
    throw err;
  }

  return {
    async get(key: string) { return await redis.get(key); },
    async set(key: string, value: string, opts?: { ex?: number }) {
      if (opts?.ex) return await redis.set(key, value, 'EX', opts.ex);
      return await redis.set(key, value);
    },
    async hgetall(key: string) { return await redis.hgetall(key); },
    async hget(key: string, field: string) { return await redis.hget(key, field); },
    async hset(key: string, kv: Record<string, string>) { return await redis.hset(key, kv); },
    async hdel(key: string, ...fields: string[]) { return await redis.hdel(key, ...fields); },
    async hexists(key: string, field: string) { return await redis.hexists(key, field); },
    async hlen(key: string) { return await redis.hlen(key); },
    async zadd(key: string, ...scoreMembers: Array<{ score: number; member: string }>) {
      const args: any[] = [];
      for (const sm of scoreMembers) { args.push(sm.score, sm.member); }
      return await redis.zadd(key, ...args);
    },
    async zrem(key: string, ...members: string[]) { return await redis.zrem(key, ...members); },
    async del(...keys: string[]) { return await redis.del(...keys); },
  };
}

// ==================== 统一工厂 ====================
let store: IRedisStore | null = null;

export async function getRedis(): Promise<IRedisStore> {
  if (store) return store;

  // 1. Vercel KV (Upstash REST)
  if (REDIS_CONFIG.mode === 'vercel-kv') {
    try {
      store = await createUpstashStore();
      return store;
    } catch (err) {
      console.warn('[Redis] Vercel KV 不可用，回退内存模式:', (err as Error).message);
    }
  }

  // 2. 标准 Redis (ioredis)
  if (REDIS_CONFIG.mode === 'redis') {
    try {
      store = await createIORedisStore();
      return store;
    } catch (err) {
      console.warn('[Redis] 标准 Redis 不可用，回退内存模式:', (err as Error).message);
    }
  }

  // 3. 内存模式（默认）
  console.log('[Redis] 使用本地内存模式（数据不会持久化）');
  store = new MemoryStore();
  return store;
}
