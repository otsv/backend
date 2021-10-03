import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { CategoryModule } from '../../module/category/category.module';
import { ProductModule } from '../../module/product/product.module';
import { UserModule } from '../../module/user/user.module';
import { SeedService } from './seed.service';
import { RoleModule } from '../../module/roles/roles.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CategoryModule,
    RoleModule,
    AppConfigModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
