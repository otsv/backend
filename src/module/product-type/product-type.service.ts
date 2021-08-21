import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductType } from './entities/product-type.entity';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectModel(ProductType)
    private readonly productTypeDoc: ReturnModelType<typeof ProductType>,
  ) {}
  async create(
    createProductTypeDto: CreateProductTypeDto,
  ): Promise<ProductType> {
    const createdType = await this.productTypeDoc.create(createProductTypeDto);
    return await createdType.save();
  }

  async findAll(): Promise<ProductType[]> {
    return await this.productTypeDoc.find();
  }

  async findOne(id: string): Promise<ProductType> {
    const type = await this.productTypeDoc.findById(id);
    if (!type) {
      throw new NotFoundException('No ProductType found');
    }
    return type;
  }

  async findByName(name: string): Promise<ProductType> {
    const type = await this.productTypeDoc.findOne({ name });
    if (!type) {
      throw new NotFoundException('No ProductType found');
    }
    return type;
  }

  async isExisted(name: string): Promise<boolean> {
    const type = await this.productTypeDoc.findOne({ name });
    return !!type;
  }

  async update(
    id: string,
    updateProductTypeDto: UpdateProductTypeDto,
  ): Promise<ProductType> {
    const productType = await this.productTypeDoc.findById(id);
    if (!productType) {
      throw new NotFoundException();
    }
    Object.assign(productType, updateProductTypeDto);
    return await productType.save();
  }

  async remove(id: string): Promise<ProductType> {
    const productType = await this.productTypeDoc.findById(id);
    if (!productType) {
      throw new NotFoundException();
    }
    return await productType.remove();
  }
}
