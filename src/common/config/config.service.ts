import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  // APP
  port: string = this.configService.get('PORT');
  environment: string = this.configService.get('NODE_ENV');

  // DATABASE
  databaseUrl: string = this.configService.get('MONGO_URL');
  databaseUsername: string = this.configService.get(
    'MONGO_INITDB_ROOT_USERNAME',
  );
  databasePassword: string = this.configService.get(
    'MONGO_INITDB_ROOT_PASSWORD',
  );
  databaseName: string = this.configService.get('MONGO_INITDB_DATABASE');

  // REDIS
  redisHost: string = this.configService.get('REDIS_HOST');
  redisPort: number = this.configService.get('REDIS_PORT');
  redisPassword: string = this.configService.get('REDIS_PASSWORD');
  redisDB: string = this.configService.get('REDIS_DB');

  // JWT
  jwtAccessSecret: string = this.configService.get('JWT_ACCESS_SECRET');
  jwtRefreshSecret: string = this.configService.get('JWT_REFRESH_SECRET');
  jwtAccessExpiration: number = this.configService.get('JWT_ACCESS_EXPIRATION');
  jwtRefreshExpiration: number = this.configService.get(
    'JWT_REFRESH_EXPIRATION',
  );

  // SEEDER
  seederAccount: boolean = this.configService.get('ACCOUNTS_SEEDER');
  seederCategories: boolean = this.configService.get('CATEGORY_SEEDER');
}
