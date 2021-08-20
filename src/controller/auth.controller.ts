import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { LocalGuard } from 'src/guards/local.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { TokenService } from 'src/module/token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/login')
  @UseGuards(LocalGuard)
  async login(@Req() request: Request) {
    const user = request.user;
    const token = await this.tokenService.generateAuthToken(user);
    return {
      ...token,
    };
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() request: Request) {
    const user = request.user;
    return { user };
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request) {
    const user = request.user as any;
    await this.tokenService.removeRefreshToken(user.id);
  }
}
