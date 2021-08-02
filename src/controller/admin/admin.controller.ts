import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { RolePermission } from 'src/common/constant/roles';
import { RequiredPermissions } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { AdminService } from 'src/module/admin/admin.service';
import { CreateUserDto } from 'src/module/user/user.dto';
import { UserService } from 'src/module/user/user.service';
import { RequestValidation } from 'src/pipe/validation.pipe';
import { createUserSchema } from './admin.schema';

@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Post('/create_account')
  @RequiredPermissions(RolePermission.manageUsers)
  @UsePipes(new RequestValidation(createUserSchema))
  async createAccount(@Body() createAccount: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createAccount);
    return user;
  }
}
