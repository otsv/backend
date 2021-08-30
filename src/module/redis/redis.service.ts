import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly redisClient: Cache) {}

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: any, ttl: number) {
    /*
      Consider future enhancement using redis, not cache-manager
      Redis support update with option KEEPTTL
    */
    return await this.redisClient.set(key, value, { ttl: ttl });
  }

  async delete(key: string) {
    return await this.redisClient.del(key);
  }
}
