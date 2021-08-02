import { Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { LocalGuard } from 'src/guards/local.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { TokenService } from 'src/module/token/token.service';
import { RequestValidation } from 'src/pipe/validation.pipe';
import { loginSchema } from './auth.schema';

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
      user,
      ...token,
    };
  }
}
