import { RoleEnum } from '../../../common/constant/roles';
import { IsEnum } from 'class-validator';

export class CreateRoleDto {
  @IsEnum(RoleEnum)
  role: string;
}
