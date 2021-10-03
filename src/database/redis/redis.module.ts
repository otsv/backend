import { Module, CacheModule } from '@nestjs/common';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-redis-store';
import { AppConfigModule } from 'src/common/config/config.module';
import { AppConfigService } from 'src/common/config/config.service';

@Module({
  imports: [
    AppConfigModule,
    CacheModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        store: redisStore,
        host: config.redisHost,
        port: config.redisPort,
        auth_pass: config.redisPassword,
        db: config.redisDB,
      }),
      imports: [AppConfigModule],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
