import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Validate } from 'class-validator';
import { Role } from 'src/common/constant/roles';
import { PasswordContains } from 'src/validation/password.validation';
import { UserStatus } from '../../../common/constant/user-status';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @Validate(PasswordContains)
  @ApiProperty()
  password: string;

  @IsString()
  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
  })
  role: string;

  @IsEnum(UserStatus)
  @ApiProperty({ enum: UserStatus })
  status: string;
}
