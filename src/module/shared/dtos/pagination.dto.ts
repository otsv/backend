import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '- Sort option in the format: sortField:(desc | asc)',
  })
  sortBy: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: '- Maximum number of results per page (default = 10)',
    minimum: 1,
    default: 10,
  })
  limit: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: '- Current page (default = 1)',
    minimum: 1,
    default: 1,
  })
  page: number;
}

export class PaginationOption {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

export class PaginationResult {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  results: any[];
}
