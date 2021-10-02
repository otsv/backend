import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @ApiProperty({ description: 'The product id' })
  productId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  note: string;
}
