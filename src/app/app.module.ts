import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { DatabaseModule } from 'src/database/mongo';
import { AuthModule } from 'src/module/auth/auth.module';
import { UserModule } from 'src/module/user/user.module';
import { AdminModule } from 'src/module/admin/admin.module';
import { ProductModule } from 'src/module/product/product.module';
import { SeedModule } from 'src/database/seed/seed.module';
import { CategoryModule } from 'src/module/category/category.module';
import { OrderModule } from 'src/module/order/order.module';
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
  providers: [],
})
export class AppModule {}
