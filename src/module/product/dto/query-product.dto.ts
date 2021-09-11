import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'src/common/constant/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from 'src/common/constant/product-status';

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
  @ApiPropertyOptional()
  status: ProductStatus;
}
