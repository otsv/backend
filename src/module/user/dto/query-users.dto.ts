import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'src/common/constant/pagination.dto';
import { RoleEnum } from 'src/common/constant/roles';

export class QueryUsersDto extends PaginationQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: RoleEnum })
  role: string;
}
