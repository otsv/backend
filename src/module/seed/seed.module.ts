import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { CategoryModule } from '../product/category/category.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { SeedService } from './seed.service';
import { RoleModule } from '../roles/roles.module';

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
