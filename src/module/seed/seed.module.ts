import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { ProductTypeModule } from '../product-type/product-type.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UserModule, ProductModule, ProductTypeModule, AppConfigModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
