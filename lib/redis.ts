/**
 * Redis 客户端 - ioredis + 本地内存回退
 *
 * - 生产环境：连接阿里云 Redis / 腾讯云 Redis 等标准 Redis
 * - 开发/演示：本地内存 Map 模式（无需外部服务，重启丢失）
 */

import { REDIS_CONFIG } from './config';

// ==================== 接口抽象 ====================

/** 统一 Redis 操作接口（兼容 ioredis 和 内存模式） */
export interface IRedisStore {
  // String
  get(key: string): Promise<string | null>;
  set(key: string, value: string, opts?: { ex?: number }): Promise<string | null>;

  // Hash
  hgetall(key: string): Promise<Record<string, string> | null>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, kv: Record<string, string>): Promise<number>;
  hdel(key: string, ...fields: string[]): Promise<number>;
  hexists(key: string, field: string): Promise<number>;
  hlen(key: string): Promise<number>;

  // Sorted Set
  zadd(key: string, ...scoreMembers: Array<{ score: number; member: string }>): Promise<number>;
  zrem(key: string, ...members: string[]): Promise<number>;

  // Generic
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
    if (opts?.ex) {
      this.expirations.set(key, Date.now() + opts.ex * 1000);
    }
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
    for (const f of fields) {
      if (f in hash) { delete hash[f]; count++; }
    }
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
    if (!zset) {
      zset = new Map<string, number>();
      this.data.set(`zset:${key}`, zset);
    }
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
    for (const m of members) {
      if (zset.delete(m)) count++;
    }
    return count;
  }

  async del(...keys: string[]) {
    let count = 0;
    for (const key of keys) {
      // 尝试删除各种类型的 key
      if (this.data.delete(key)) count++;
      if (this.data.delete(`hash:${key}`)) count++;
      if (this.data.delete(`zset:${key}`)) count++;
    }
    return count;
  }
}

// ==================== ioredis 模式 ====================

let RedisClient: any = null;

async function getIORedis(): Promise<IRedisStore> {
  if (!RedisClient) {
    const { default: Redis } = await import('ioredis');

    // 优先使用完整 URL 连接
    if (REDIS_CONFIG.url) {
      RedisClient = new Redis(REDIS_CONFIG.url, {
        maxRetriesPerRequest: 3,
        retryStrategy(times: number) {
          if (times > 3) return null; // 3 次后放弃
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });
    } else {
      RedisClient = new Redis({
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
    }

    try {
      await RedisClient.connect();
      console.log('[Redis] ioredis 已连接');
    } catch (err) {
      console.warn('[Redis] ioredis 连接失败，回退到内存模式:', (err as Error).message);
      RedisClient = null;
      return new MemoryStore();
    }
  }

  return wrapIORedis(RedisClient);
}

function wrapIORedis(redis: any): IRedisStore {
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

// ==================== 统一出口 ====================

let store: IRedisStore | null = null;

export async function getRedis(): Promise<IRedisStore> {
  if (store) return store;

  if (REDIS_CONFIG.mode === 'redis' || REDIS_CONFIG.url || REDIS_CONFIG.host) {
    try {
      store = await getIORedis();
      return store;
    } catch (err) {
      console.warn('[Redis] 初始化失败，使用内存模式:', (err as Error).message);
    }
  }

  // 默认使用内存模式
  console.log('[Redis] 使用本地内存模式（数据不会持久化）');
  store = new MemoryStore();
  return store;
}
