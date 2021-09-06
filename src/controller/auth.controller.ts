import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { LocalGuard } from 'src/guards/local.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { Jwt, JwtRefreshTokenDto } from 'src/module/auth/dto/jwt.dto';
import { LoginDto } from 'src/module/auth/dto/login.dto';
import { User } from 'src/module/user/entities/user.entity';

@Controller('auth')
@ApiTags('Authenticate')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ type: Jwt })
  async login(@Req() request: Request): Promise<Jwt> {
    const user = request.user;
    return await this.authService.login(user);
  }

  @Delete('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logout(@Req() request: Request) {
    const user = request.user as User;
    return await this.authService.logout(user);
  }

  @Post('/refresh-token')
  @ApiBody({ type: JwtRefreshTokenDto })
  async refreshToken(@Body() refreshTokenDto: JwtRefreshTokenDto) {
    return await this.authService.refreshAccessToken(refreshTokenDto);
  }
}
