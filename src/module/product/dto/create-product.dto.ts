import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  images: string[];
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
}
