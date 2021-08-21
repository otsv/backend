import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from '../../controller/product.controller';
import { Product } from './entities/product.entity';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductTypeModule } from '../product-type/product-type.module';

@Module({
  imports: [TypegooseModule.forFeature([Product]), ProductTypeModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
