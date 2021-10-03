import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'src/module/shared/dtos/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from 'src/module/product/constants/product.constant';

export class QueryProductsDto extends PaginationQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  price: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  type: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiPropertyOptional({ enum: ProductStatus })
  status: ProductStatus;
}
