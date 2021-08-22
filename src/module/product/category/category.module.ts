import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategoryController } from 'src/controller/category.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypegooseModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
