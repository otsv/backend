import { Injectable } from '@nestjs/common';
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
    await this.seedCategories();
  }

  private async seedCategories() {
    if (this.configService.seederCategories) {
      for (const type of categories) {
        const isExisted = await this.categoryService.isExisted(type.name);
        if (!isExisted) {
          await this.categoryService.create(type);
        }
      }
    }
  }
}
