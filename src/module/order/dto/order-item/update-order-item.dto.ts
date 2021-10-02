import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { OrderItemStatus } from 'src/common/constant/product-status';

export class UpdateOrderItemDto {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  note: string;

  @ApiPropertyOptional()
  @IsEnum(OrderItemStatus)
  @IsOptional()
  status: OrderItemStatus;
}
