import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/module/roles/constants';

export const ACL_KEY = 'roles';
export const Acl = (...roles: Required<RoleType[]>) =>
  SetMetadata(ACL_KEY, roles);
