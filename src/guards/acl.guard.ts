import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/constant/roles';
import { ACL_KEY } from 'src/decorator/acl.decorator';

@Injectable()
export class AclGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>(ACL_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole = user.role.name;

    return roles.includes(userRole);
  }
}
