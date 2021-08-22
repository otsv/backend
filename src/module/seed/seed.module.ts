import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { CategoryModule } from '../product/category/category.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UserModule, ProductModule, CategoryModule, AppConfigModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
