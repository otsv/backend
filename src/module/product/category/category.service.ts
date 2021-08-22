import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryDoc: ReturnModelType<typeof Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdType = await this.categoryDoc.create(createCategoryDto);
    return await createdType.save();
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryDoc.find();
  }

  async findOne(id: string): Promise<Category> {
    const type = await this.categoryDoc.findById(id);
    if (!type) {
      throw new NotFoundException('No Category found');
    }
    return type;
  }

  async findByName(name: string): Promise<Category> {
    const type = await this.categoryDoc.findOne({ name });
    if (!type) {
      throw new NotFoundException('No Category found');
    }
    return type;
  }

  async isExisted(name: string): Promise<boolean> {
    const type = await this.categoryDoc.findOne({ name });
    return !!type;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const Category = await this.categoryDoc.findById(id);
    if (!Category) {
      throw new NotFoundException();
    }
    Object.assign(Category, updateCategoryDto);
    return await Category.save();
  }

  async remove(id: string): Promise<Category> {
    const Category = await this.categoryDoc.findById(id);
    if (!Category) {
      throw new NotFoundException();
    }
    return await Category.remove();
  }
}
