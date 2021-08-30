import { Role } from '../../../common/constant/roles';
import { IsEnum } from 'class-validator';

export class CreateRoleDto {
  @IsEnum(Role)
  role: string;
}
