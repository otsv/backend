import { ApiProperty } from '@nestjs/swagger';

export class Jwt {
  accessToken: string;
  refreshToken: string;
}

export class JwtRefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}
