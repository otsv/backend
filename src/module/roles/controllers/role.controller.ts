import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/module/roles/constants';
import { Acl } from 'src/decorators/acl.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { ResponseInterceptor } from 'src/Interceptors/response.interceptor';
import { RoleService } from 'src/module/roles/services/roles.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, AclGuard)
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Acl(RoleType.admin)
  @UseInterceptors(ResponseInterceptor)
  @ApiBearerAuth()
  async getAllRoles() {
    return await this.roleService.getAllRoles();
  }
}
