import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { AppConfigService } from 'src/common/config/config.service';
import { toJson } from './plugin/toJson';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => ({
        uri: config.databaseUrl,
        connectionFactory: (connection) => {
          connection.plugin(toJson);
          return connection;
        },
      }),
      inject: [AppConfigService],
    }),
  ],
})
export class DatabaseModule {}
