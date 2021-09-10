import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { RoleEnum } from 'src/common/constant/roles';
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
  @IsEnum(RoleEnum)
  @ApiProperty({
    enum: RoleEnum,
  })
  role: string;

  @IsEnum(UserStatus)
  @IsOptional()
  @ApiProperty({ enum: UserStatus })
  status: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional({ nullable: true })
  phone?: string;

  @ApiPropertyOptional({ nullable: true, description: 'mutilpart file' })
  @IsOptional()
  avatar?: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  @Min(0)
  @Max(99)
  @ApiPropertyOptional({ default: 1 })
  dailyBalance: number;
}
