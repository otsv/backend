import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'src/common/constant/pagination.dto';
import { Role } from 'src/common/constant/roles';

export class QueryUsersDto extends PaginationQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: Role })
  role: string;
}
