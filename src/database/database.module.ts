import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { AppConfigService } from 'src/common/config/config.service';

@Module({
  imports: [
    AppConfigModule,
    TypegooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => ({
        uri: config.databaseUrl,
        useNewUrlParser: true,
      }),
      inject: [AppConfigService],
    }),
  ],
})
export class DatabaseModule {}
