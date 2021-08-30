import { Injectable } from '@nestjs/common';
import * as products from 'json/seed_products.json';
import * as categories from 'json/seed_product_types.json';
import { AppConfigService } from 'src/common/config/config.service';
import { CategoryService } from '../product/category/category.service';
import { ProductService } from '../product/product.service';
import { RoleService } from '../roles/roles.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly roleService: RoleService,
    private readonly configService: AppConfigService,
  ) {}

  /**
   * TODO: Seed function will improve by using shell, this is not a correct to do it
   */
  async seed() {
    this.seedCategories();
    this.seedProducts();
  }

  private seedProducts() {
    if (this.configService.seederProduct) {
      products.forEach(async (product) => {
        const isExisted = await this.productService.isExisted(product.name);
        if (!isExisted) {
          await this.productService.create(product);
        }
      });
    }
  }

  private seedCategories() {
    if (this.configService.seederCategories) {
      categories.forEach(async (type) => {
        const isExisted = await this.categoryService.isExisted(type.name);
        if (!isExisted) {
          await this.categoryService.create(type);
        }
      });
    }
  }
}
