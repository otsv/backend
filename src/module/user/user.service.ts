import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { AppConfigService } from 'src/common/config/config.service';
import { PaginationOption } from 'src/common/constant/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userDoc: ReturnModelType<typeof User>,
    private readonly config: AppConfigService,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    if (await this.isEmailTaken(user.email)) {
      throw new BadRequestException('Email already taken');
    }
    const createdUser = await this.userDoc.create(user);
    return await createdUser.save();
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
  async getUsers(filter, options: PaginationOption) {
    return this.userDoc.paginate(filter, options);
  }

  async isEmailTaken(email: string, excludeEmail?: string): Promise<boolean> {
    const user = await this.userDoc.findOne({
      email,
      _id: { $ne: excludeEmail },
    });
    return !!user;
  }

  async seedAccounts() {
    try {
      if (this.config.seederAccount) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const accounts = require('../../../json/seed_accounts.json');

        accounts.forEach(async (account) => {
          const isExisted = await this.userDoc.findOne({
            email: account.email,
          });
          if (!isExisted) {
            await this.userDoc.create(account);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
