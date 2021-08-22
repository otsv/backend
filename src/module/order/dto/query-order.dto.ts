import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderState } from 'src/common/constant/order-status';
import { PaginationQuery } from 'src/common/constant/pagination.dto';

export class QueryOrderDto extends PaginationQuery {
  @IsEnum(OrderState)
  @IsOptional()
  @ApiPropertyOptional()
  status: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  email: string;
}
