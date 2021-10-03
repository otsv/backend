import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { PaginationOption } from 'src/module/shared/dtos/pagination.dto';
import { CategoryService } from '../../category/services/category.service';
import { UserDoc } from '../../user/entities/user.entity';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { drinkPath } from '../constants/product.constant';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productDoc: ReturnModelType<typeof Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    createBy?: UserDoc,
  ): Promise<Product> {
    try {
      const type = await this.categoryService.findByName(createProductDto.type);
      const createdProduct = await this.productDoc.create({
        ...createProductDto,
        type,
      });
      if (createBy) {
        Object.assign(createdProduct, { createdBy: createBy.id });
      }
      return await createdProduct.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Query for product
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  async queryProducts(filter, options: PaginationOption) {
    if (filter.type) {
      const type = await this.categoryService.findByName(filter.type);
      delete filter.type;
      Object.assign(filter, {
        'type._id': new mongoose.Types.ObjectId(type.id),
      });
    }
    const products = await this.productDoc.paginate(filter, options);
    return products;
  }

  async count() {
    return await this.productDoc.count();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productDoc.findById(id);
    if (!product) {
      throw new NotFoundException(`The product id ${id} not found`);
    }
    return product;
  }

  async isExisted(name: string): Promise<boolean> {
    const product = await this.productDoc.findOne({
      name,
    });
    return !!product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    updateBy?: UserDoc,
  ): Promise<Product> {
    try {
      const product = await this.productDoc.findById(id);
      if (!product) {
        throw new NotFoundException();
      }
      const oldImages = product.images;
      Object.assign(product, updateProductDto);

      if (updateProductDto.type) {
        const type = await this.categoryService.findByName(
          updateProductDto.type,
        );
        Object.assign(product, { type });
      }

      if (updateBy) {
        Object.assign(product, {
          updatedBy: updateBy.id,
          updatedAt: Date.now(),
        });
      }

      const updatedProduct = await product.save();

      if (oldImages && updateProductDto.images) {
        for (const file of oldImages) {
          await unlink(path.join(drinkPath, file));
        }
      }

      return updatedProduct;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productDoc.findById(id);
    if (!product) {
      throw new NotFoundException();
    }
    return await product.remove();
  }
}
