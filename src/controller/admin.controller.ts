import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { RolePermission } from 'src/common/constant/roles';
import { RequiredPermissions } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { AdminService } from 'src/module/admin/admin.service';
import { QueryUsersDto } from 'src/module/user/dto/query-users.dto';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import { UserService } from 'src/module/user/user.service';
import { pick } from 'lodash';

@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Post('/create-account')
  @RequiredPermissions(RolePermission.manageUsers)
  async createAccount(@Body() createAccount: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createAccount);
    return user;
  }

  @Get('/get-users')
  @RequiredPermissions(RolePermission.manageUsers)
  async getUsers(@Query() query: QueryUsersDto) {
    const filter = pick(query, ['role', 'name']);
    const options = pick(query, ['sortBy', 'limit', 'page']);
    return await this.userService.getUsers(filter, options);
  }
}
