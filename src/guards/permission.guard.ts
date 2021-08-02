import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, RoleConfig, RolePermission } from 'src/common/constant/roles';
import { PERMISSIONS_KEY } from 'src/decorator/roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RolePermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const role: Role = Role[user.role as string];
    return requiredPermissions.every((permission) =>
      RoleConfig.get(role).includes(permission),
    );
  }
}
