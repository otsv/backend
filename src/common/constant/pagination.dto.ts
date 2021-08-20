import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQuery {
  @IsString()
  @IsOptional()
  sortBy: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page: number;
}

export class PaginationOption {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}
