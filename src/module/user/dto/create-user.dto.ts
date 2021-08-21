import { IsEmail, IsIn, IsString, Validate } from 'class-validator';
import { Role } from 'src/common/constant/roles';
import { PasswordContains } from 'src/validation/password.validation';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    enum: Role,
  })
  @IsIn(Object.keys(Role))
  role: string;
}
