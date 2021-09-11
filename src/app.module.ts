import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigModule } from './common/config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { AdminModule } from './module/admin/admin.module';
import { ProductModule } from './module/product/product.module';
import { SeedModule } from './module/seed/seed.module';
import { CategoryModule } from './module/product/category/category.module';
import { OrderModule } from './module/order/order.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    AdminModule,
    ProductModule,
    SeedModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'src', 'public'),
    }),
    CategoryModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
