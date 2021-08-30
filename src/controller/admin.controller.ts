import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { pick } from 'lodash';
import { PaginationResult } from 'src/common/constant/pagination.dto';
import { Role } from 'src/common/constant/roles';
import { Acl } from 'src/decorator/acl.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { AdminService } from 'src/module/admin/admin.service';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import { QueryUsersDto } from 'src/module/user/dto/query-users.dto';
import { User } from 'src/module/user/entities/user.entity';
import { UserService } from 'src/module/user/user.service';
import { ResponseUserWithoutPassword } from 'src/module/user/user.type';

@Controller('admin')
@UseGuards(JwtAuthGuard, AclGuard)
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Post('/accounts')
  @Acl(Role.Admin)
  @ApiBearerAuth()
  @ApiResponse({ type: User })
  async createAccount(
    @Body() createAccount: CreateUserDto,
  ): Promise<ResponseUserWithoutPassword> {
    return await this.userService.createUser(createAccount);
  }

  @Get('/accounts')
  @Acl(Role.Admin)
  @ApiBearerAuth()
  @ApiResponse({ type: PaginationResult })
  async getUsers(@Query() query: QueryUsersDto) {
    const filter = pick(query, ['role', 'name']);
    const options = pick(query, ['sortBy', 'limit', 'page']);
    return await this.userService.getUsers(filter, options);
  }
}
