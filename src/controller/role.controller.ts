import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/constant/roles';
import { Acl } from 'src/decorator/acl.decorator';
import { AclGuard } from 'src/guards/acl.guard';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { ResponseInterceptor } from 'src/Interceptors/response.interceptor';
import { RoleService } from 'src/module/roles/roles.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, AclGuard)
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Acl(Role.Admin)
  @UseInterceptors(ResponseInterceptor)
  @ApiBearerAuth()
  async getAllRoles() {
    return await this.roleService.getAllRoles();
  }
}
