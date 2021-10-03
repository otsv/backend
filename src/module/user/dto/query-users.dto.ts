import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RoleType } from 'src/module/roles/constants';
import { PaginationQuery } from 'src/module/shared/dtos/pagination.dto';

export class QueryUsersDto extends PaginationQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: RoleType })
  role: string;
}
