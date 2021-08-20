import { IsEmail, IsIn, IsString, Validate } from 'class-validator';
import { Role } from 'src/common/constant/roles';
import { PasswordContains } from 'src/validation/custom.validation';

export class CreateUserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;

  @Validate(PasswordContains)
  password: string;

  @IsString()
  @IsIn(Object.keys(Role))
  role: string;
}
