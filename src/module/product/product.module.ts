import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypegooseModule.forFeature([Product]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
