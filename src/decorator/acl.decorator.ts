import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/common/constant/roles';

export const ACL_KEY = 'roles';
export const Acl = (...roles: Required<RoleEnum[]>) =>
  SetMetadata(ACL_KEY, roles);
