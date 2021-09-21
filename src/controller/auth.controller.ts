import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { multerOptions } from 'src/common/constant/upload-file.option';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { LocalGuard } from 'src/guards/local.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { ChangePasswordDto, UpdateUserDto } from 'src/module/auth/dto/auth.dto';
import { Jwt, JwtRefreshTokenDto } from 'src/module/auth/dto/jwt.dto';
import { LoginDto } from 'src/module/auth/dto/login.dto';
import { User, UserDoc } from 'src/module/user/entities/user.entity';
import { pick } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

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

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: User })
  async session(@Req() request: Request) {
    const user = request.user as User;
    return { user };
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Invalid password' })
  @HttpCode(200)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: Request,
  ) {
    const user = request.user as UserDoc;
    return await this.authService.changePassword(
      user,
      changePasswordDto.password,
      changePasswordDto.newPassword,
    );
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      multerOptions('avatar', (req: Request, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
      }),
    ),
  )
  async updateProfile(
    @Body() updateDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    try {
      const user = request.user as UserDoc;
      const data = pick(updateDto, ['name', 'phone']);
      if (file) {
        Object.assign(data, {
          avatar: file.filename,
        });
      }
      const updatedUser = await this.authService.updateProfile(user, data);

      return updatedUser;
    } catch (err) {
      if (file) {
        await unlink(file.path);
      }
      throw err;
    }
  }
}
