import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { omit } from 'lodash';
import { InjectModel } from 'nestjs-typegoose';
import { AppConfigService } from 'src/common/config/config.service';
import { PaginationOption } from 'src/common/constant/pagination.dto';
import { RoleService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ResponseUserWithoutPassword } from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userDoc: ReturnModelType<typeof User>,
    private readonly config: AppConfigService,
    private readonly roleService: RoleService,
  ) {}

  async createUser(user: CreateUserDto): Promise<ResponseUserWithoutPassword> {
    if (await this.isEmailTaken(user.email)) {
      throw new BadRequestException('Email already taken');
    }

    const role = await this.roleService.filterRoleByName(user.role);
    const createdUser = await this.userDoc.create({
      ...user,
      role,
    });
    const response = { ...user, id: createdUser._id, role: role.name };

    return omit(response, ['password']);
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

  async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    const user = await this.userDoc.findOne({
      email,
      _id: { $ne: excludeUserId },
    });
    return !!user;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userDoc.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userDoc.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
