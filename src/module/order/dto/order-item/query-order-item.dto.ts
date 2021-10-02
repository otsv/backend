import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'src/common/constant/pagination.dto';
import { OrderItemStatus } from 'src/common/constant/product-status';

export class QueryOrderItem extends PaginationQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  accountEmail: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  fromDate: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  toDate: string;

  @IsEnum(OrderItemStatus)
  @IsOptional()
  @ApiPropertyOptional({ enum: OrderItemStatus })
  status: OrderItemStatus;
}
