import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Error as MongoException } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { RoleType } from 'src/module/roles/constants';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role, RoleDoc } from '../enitties/roles.entity';

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

      return createdRole.save();
    } catch (e) {
      throw new MongoException(e);
    }
  }

  async getRole(role: RoleType): Promise<RoleDoc> {
    try {
      return this.roleDocument.findOne({
        name: role,
      });
    } catch (e) {
      throw new NotFoundException('Role not found');
    }
  }
}
