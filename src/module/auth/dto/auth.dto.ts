import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import { PasswordContains } from 'src/module/shared/validation/password.validation';
export class ChangePasswordDto {
  @ApiProperty()
  password: string;

  @Validate(PasswordContains)
  @ApiProperty()
  newPassword: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'email',
    'password',
    'role',
    'status',
    'dailyBalance',
  ]),
) {}
