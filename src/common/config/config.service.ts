import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  databaseUrl: string = this.configService.get('MONGO_URL');
  port: string = this.configService.get('PORT');
  environment: string = this.configService.get('NODE_ENV');
  jwtSecret: string = this.configService.get('JWT_SECRET');
  jwtAccessExpiration: string = this.configService.get('JWT_ACCESS_EXPIRATION');
  jwtRefreshExpiration: string = this.configService.get(
    'JWT_REFRESH_EXPIRATION',
  );
  seederAccount: boolean = this.configService.get('ACCOUNTS_SEEDER');
}
