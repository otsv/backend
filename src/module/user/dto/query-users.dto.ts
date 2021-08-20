import { IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'src/common/constant/pagination.dto';

export class QueryUsersDto extends PaginationQuery {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  role: string;
}
