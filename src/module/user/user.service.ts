import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { AppConfigService } from 'src/common/config/config.service';
import { PaginationOption } from 'src/common/constant/pagination.dto';
import { RoleEnum } from 'src/common/constant/roles';
import { RoleService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { User, UserDoc } from './entities/user.entity';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { avatarPath } from 'src/common/constant/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userDoc: ReturnModelType<typeof User>,
    private readonly config: AppConfigService,
    private readonly roleService: RoleService,
  ) {}

  async createUser(user: CreateUserDto): Promise<ResponseUserDto> {
    if (await this.isEmailTaken(user.email)) {
      throw new BadRequestException('Email already taken');
    }
    const role = await this.roleService.getRole(RoleEnum[user.role]);
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

    return user;
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
      const role = await this.roleService.getRole(RoleEnum[updateDto.role]);
      Object.assign(updateDto, { role });
    }
    Object.assign(user, updateDto);
    return await user.save();
  }
}
