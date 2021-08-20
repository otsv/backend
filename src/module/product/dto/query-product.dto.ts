import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'src/common/constant/pagination.dto';

export class QueryProductsDto extends PaginationQuery {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsNumber()
  price: number;
}
