import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class ResponseUserDto extends CreateUserDto {
  @ApiProperty()
  id: string;
}
