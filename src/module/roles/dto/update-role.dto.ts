import { Role } from '../../../common/constant/roles';
import { IsEnum } from 'class-validator';

export class UpdateRoleDto {
  @IsEnum(Role)
  role: string;
}
