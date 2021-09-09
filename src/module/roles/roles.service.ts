import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Error as MongoException } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { RoleEnum } from 'src/common/constant/roles';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role, RoleDoc } from './roles.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleDocument: ReturnModelType<typeof Role>,
  ) {}

  async getAllRoles() {
    return await this.roleDocument.find({});
  }

  async findRoleById(_id: string): Promise<RoleDoc> {
    const roleModel = await this.roleDocument.findById(_id);

    if (!roleModel) {
      throw new NotFoundException('Role not found');
    }
    return roleModel;
  }

  async addRole(createRoleDto: CreateRoleDto): Promise<RoleDoc> {
    try {
      const createdRole = await this.roleDocument.create({
        name: createRoleDto.role,
      });

      return await createdRole.save();
    } catch (e) {
      throw new MongoException(e);
    }
  }

  async getRole(role: RoleEnum): Promise<RoleDoc> {
    try {
      return await this.roleDocument.findOne({
        name: role,
      });
    } catch (e) {
      throw new MongoException(e);
    }
  }
}
