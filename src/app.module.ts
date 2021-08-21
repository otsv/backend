import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './common/config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { AdminModule } from './module/admin/admin.module';
import { TokenModule } from './module/token/token.module';
import { ProductModule } from './module/product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SeedModule } from './module/seed/seed.module';
import { ProductTypeModule } from './module/product-type/product-type.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    AdminModule,
    TokenModule,
    ProductModule,
    SeedModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProductTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
