import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  images: string[];

  @ApiPropertyOptional()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enumName: 'Category', description: 'Product Category' })
  type: string;
}
