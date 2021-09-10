import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';

export class UpdateAccountDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @ApiProperty()
  email: string;
}
