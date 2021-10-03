import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from 'src/module/roles/constants';
import { ACL_KEY } from 'src/decorators/acl.decorator';

@Injectable()
export class AclGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[]>(ACL_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole = user.role.name;

    return roles.includes(userRole);
  }
}
