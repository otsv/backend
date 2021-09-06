import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Error as MongoException, Schema } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role as RoleEntity } from './roles.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleEntity)
    private readonly roleDocument: ReturnModelType<typeof RoleEntity>,
  ) {}

  async getAllRoles() {
    return await this.roleDocument.find({});
  }

  async findRoleById(_id: Schema.Types.ObjectId): Promise<RoleEntity> {
    const roleModel = await this.roleDocument.findById(_id);

    if (!roleModel) {
      throw new NotFoundException('Role not found');
    }

    return roleModel;
  }

  async addRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    try {
      const createdRole = await this.roleDocument.create({
        name: createRoleDto.role,
      });

      return await createdRole.save();
    } catch (e) {
      throw new MongoException(e);
    }
  }

  async updateRole(
    roleId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    updateRoleDto: UpdateRoleDto,
  ) {
    try {
      const role = await this.findRoleById(roleId);
      role.name = updateRoleDto.role;
      role.updatedBy = userId;
      role.updatedAt = new Date();

      return await this.roleDocument.updateOne({ _id: roleId }, role);
    } catch (e) {
      throw new MongoException(e);
    }
  }

  async filterRoleByName(role: string) {
    try {
      return await this.roleDocument.findOne({ name: role });
    } catch (e) {
      throw new MongoException(e);
    }
  }
}
