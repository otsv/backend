import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigSchema } from './config.schema';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ConfigSchema,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
