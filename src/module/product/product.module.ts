import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from '../../controller/product.controller';
import { Product } from './entities/product.entity';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [TypegooseModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
