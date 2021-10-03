import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategoryController } from 'src/module/category/controllers/category.controller';
import { CategoryService } from './services/category.service';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypegooseModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
