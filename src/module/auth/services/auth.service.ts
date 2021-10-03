import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { unlink } from 'fs/promises';
import * as moment from 'moment';
import { InjectModel } from 'nestjs-typegoose';
import * as path from 'path';
import { AppConfigService } from 'src/common/config/config.service';
import { RedisService } from 'src/database/redis/redis.service';
import { avatarPath } from 'src/module/user/constants/user.constant';
import { User, UserDoc } from '../../user/entities/user.entity';
import { Jwt, JwtRefreshTokenDto } from '../dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userDoc: ReturnModelType<typeof User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly appConfig: AppConfigService,
  ) {}

  private generateEpochTime(seconds): number {
    return moment().add(seconds, 'seconds').unix();
  }

  private generateAccessToken(payload: Record<string, any>): string {
    const { jwtAccessExpiration, jwtAccessSecret } = this.appConfig;

    return this.jwtService.sign(payload, {
      secret: jwtAccessSecret,
      expiresIn: jwtAccessExpiration,
    });
  }

  private generateRefreshToken(payload: Record<string, any>): string {
    const { jwtRefreshExpiration, jwtRefreshSecret } = this.appConfig;

    return this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: jwtRefreshExpiration,
    });
  }

  async isValidAccessToken(
    userId: string,
    accessToken: string,
  ): Promise<boolean> {
    const userToken = (await this.redisService.get(userId)) as Jwt;

    if (!userToken || userToken.accessToken !== accessToken) {
      return false;
    }

    return true;
  }

  async isValidRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const userToken = (await this.redisService.get(userId)) as Jwt;

    if (!userToken || userToken.refreshToken !== refreshToken) {
      return false;
    }

    return true;
  }

  async authenticateWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userDoc
      .findOne({ email })
      .populate('role', 'name -_id');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }

  private async generateJwt(payload: any): Promise<Jwt> {
    const userId = payload.sub.toString();
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    const jwt = { accessToken, refreshToken };

    await this.redisService.set(
      userId,
      jwt,
      this.appConfig.jwtRefreshExpiration,
    );
    return jwt;
  }

  async login(user: any): Promise<Jwt> {
    const { name, email, status } = user;
    const payload = {
      name,
      email,
      status,
      sub: user._id.toString(),
      role: user.role.name,
    };

    try {
      return await this.generateJwt(payload);
    } catch (e) {
      throw new UnauthorizedException(
        `Error occur when setting token, ${e.message}`,
      );
    }
  }

  async logout({ id: userId }): Promise<Record<string, string>> {
    try {
      await this.redisService.delete(userId);
      return { message: 'Logged out!' };
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async refreshAccessToken(
    refreshTokenDto: JwtRefreshTokenDto,
  ): Promise<Record<string, string>> {
    const { jwtRefreshExpiration, jwtRefreshSecret } = this.appConfig;
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtRefreshSecret,
      });
      delete payload.iat;
      delete payload.exp;

      const userId = payload.sub;
      if (!this.isValidRefreshToken(userId, refreshToken)) {
        throw new BadRequestException('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(payload);
      await this.redisService.set(
        userId,
        { accessToken, refreshToken },
        jwtRefreshExpiration,
      );

      return { accessToken };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async changePassword(user: UserDoc, password: string, newPassword: string) {
    if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        { message: 'Invalid password' },
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(user, { password: newPassword });
    await user.save();
  }

  async updateProfile(user: UserDoc, updateDto: any): Promise<UserDoc> {
    if (user.avatar && updateDto.avatar && user.avatar != updateDto.avatar) {
      await unlink(path.join(avatarPath, user.avatar));
    }
    Object.assign(user, updateDto);
    return await user.save();
  }
}
