import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/constant/roles';

export const ACL_KEY = 'roles';
export const Acl = (...roles: Required<Role[]>) => SetMetadata(ACL_KEY, roles);
