import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'src/common/constant/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductsDto extends PaginationQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  price: number;
}
