import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UserModule, ProductModule, AppConfigModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
