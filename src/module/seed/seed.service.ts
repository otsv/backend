import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/common/config/config.service';
import { CategoryService } from '../product/category/category.service';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly configService: AppConfigService,
  ) {}

  async seed() {
    await this.seedAccounts();
    await this.seedCategories();
    await this.seedProducts();
  }

  private async seedAccounts() {
    if (this.configService.seederAccount) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const accounts = require('../../../json/seed_accounts.json');

      accounts.forEach(async (account) => {
        const isExisted = await this.userService.isEmailTaken(account.email);
        if (!isExisted) {
          await this.userService.createUser(account);
        }
      });
    }
  }

  private async seedProducts() {
    if (this.configService.seederProduct) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const products = require('../../../json/seed_products.json');

      products.forEach(async (product) => {
        const isExisted = await this.productService.isExisted(product.name);
        if (!isExisted) {
          await this.productService.create(product);
        }
      });
    }
  }

  private async seedCategories() {
    if (this.configService.seederCategories) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const types = require('../../../json/seed_product_types.json');

      types.forEach(async (type) => {
        const isExisted = await this.categoryService.isExisted(type.name);
        if (!isExisted) {
          await this.categoryService.create(type);
        }
      });
    }
  }
}
