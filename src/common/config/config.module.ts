import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config.schema';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
