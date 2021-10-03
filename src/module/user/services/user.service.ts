import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { AppConfigService } from 'src/common/config/config.service';
import { PaginationOption } from 'src/module/shared/dtos/pagination.dto';
import { RoleService } from 'src/module/roles/services/roles.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { User, UserDoc } from '../entities/user.entity';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { OrderItemManager } from 'src/module/order/entities/order-item-management';
import { RoleType } from 'src/module/roles/constants';
import { avatarPath } from '../constants/user.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userDoc: ReturnModelType<typeof User>,
    @InjectModel(OrderItemManager)
    private readonly orderManagerDoc: ReturnModelType<typeof OrderItemManager>,
    private readonly config: AppConfigService,
    private readonly roleService: RoleService,
  ) {}

  async createUser(user: CreateUserDto): Promise<ResponseUserDto> {
    if (await this.isEmailTaken(user.email)) {
      throw new BadRequestException('Email already taken');
    }
    const role = await this.roleService.getRole(RoleType[user.role]);
    const createdUser = await this.userDoc.create({
      ...user,
      role,
    });
    const userResponse = createdUser.toJSON();
    const response = { ...userResponse, role: role.name };

    return response;
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
    if (filter.role) {
      const role = await this.roleService.getRole(RoleType[filter.role]);
      Object.assign(filter, { role });
    }
    return this.userDoc.paginate(filter, { ...options, populate: 'role' });
  }

  async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    const user = await this.userDoc.findOne({
      email,
      _id: { $ne: excludeUserId },
    });
    return !!user;
  }

  async findUserById(id: string): Promise<UserDoc> {
    const user = await this.userDoc.findById(id).populate('role');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    //yyyy-mm-dd
    const dateCreated = new Date().toISOString().slice(0, 10);
    const todayOrders = await this.orderManagerDoc.findOne(
      {
        accountEmail: user.email,
        date: new Date(dateCreated),
      },
      { totalItems: 1 },
    );
    let remainingBalance = user.dailyBalance;
    if (todayOrders) {
      remainingBalance -= todayOrders.totalItems;
    }

    return Object.assign(user, { remainingBalance });
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userDoc.findOne({ email }).populate('role');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(user: UserDoc, updateDto: any): Promise<UserDoc> {
    if (updateDto.email && user.email != updateDto.email) {
      if (await this.isEmailTaken(updateDto.email)) {
        throw new BadRequestException('Email already taken');
      }
    }

    if (user.avatar && updateDto.avatar && user.avatar != updateDto.avatar) {
      await unlink(path.join(avatarPath, user.avatar));
    }

    if (updateDto.role) {
      const role = await this.roleService.getRole(RoleType[updateDto.role]);
      Object.assign(updateDto, { role });
    }
    Object.assign(user, updateDto);
    return await user.save();
  }
}
