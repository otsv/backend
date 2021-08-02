import { SetMetadata } from '@nestjs/common';
import { RolePermission } from 'src/common/constant/roles';

export const PERMISSIONS_KEY = 'permissions';
export const RequiredPermissions = (...permissions: RolePermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
