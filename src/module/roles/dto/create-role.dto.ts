import { RoleType } from 'src/module/roles/constants';
import { IsEnum } from 'class-validator';

export class CreateRoleDto {
  @IsEnum(RoleType)
  role: string;
}
