import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationOption } from 'src/common/constant/pagination.dto';
import { ProductTypeService } from '../product-type/product-type.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productDoc: ReturnModelType<typeof Product>,
    private readonly productTypeService: ProductTypeService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const type = await this.productTypeService.findByName(
      createProductDto.type,
    );
    const createdProduct = await this.productDoc.create({
      ...createProductDto,
      type: type,
    });
    return await createdProduct.save();
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
      const type = await this.productTypeService.findByName(filter.type);
      delete filter.type;
      filter = { ...filter, type };
    }
    const products = await this.productDoc.paginate(filter, {
      ...options,
      populate: 'type',
    });
    return products;
  }

  async count() {
    return await this.productDoc.count();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productDoc.findById(id).populate('type');
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async isExisted(name: string): Promise<boolean> {
    const product = await this.productDoc
      .findOne({
        name,
      })
      .populate('type');

    return !!product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productDoc.findById(id).populate('type');
    if (!product) {
      throw new NotFoundException();
    }
    Object.assign(product, updateProductDto);
    return await product.save();
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productDoc.findById(id).populate('type');
    if (!product) {
      throw new NotFoundException();
    }
    return await product.remove();
  }
}
