import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class OrderItemDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @ApiProperty({ description: 'The product id' })
  productId: string;
}
