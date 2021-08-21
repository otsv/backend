import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { LocalGuard } from 'src/guards/local.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { LoginDto } from 'src/module/auth/dto/login.dto';
import { TokenService } from 'src/module/token/token.service';
import { User } from 'src/module/user/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
        refreshToken: {
          type: 'string',
        },
      },
    },
  })
  async login(@Req() request: Request) {
    const user = request.user;
    const token = await this.tokenService.generateAuthToken(user);
    return {
      ...token,
    };
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: User })
  async getUser(@Req() request: Request) {
    const user = request.user;
    return { user };
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async logout(@Req() request: Request) {
    const user = request.user as any;
    await this.tokenService.removeRefreshToken(user.id);
  }
}
