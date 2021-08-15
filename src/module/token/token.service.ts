import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenDocument } from './token.entity';
import * as moment from 'moment';
import { TokenType } from 'src/common/constant/token';
import { AppConfigService } from 'src/common/config/config.service';
import * as mongoose from 'mongoose';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('Token') private readonly tokenDoc: Model<TokenDocument>,
    private readonly config: AppConfigService,
  ) {}

  async generateAuthToken(user: any): Promise<any> {
    const accessTokenExpiration = moment().add(
      this.config.jwtAccessExpiration,
      'days',
    );

    const accessToken = this._signToken(
      user.id,
      TokenType.access,
      accessTokenExpiration,
    );

    const refreshTokenExpiration = moment().add(
      this.config.jwtRefreshExpiration,
      'days',
    );

    const refreshToken = this._signToken(
      user.id,
      TokenType.refresh,
      refreshTokenExpiration,
    );

    await this.tokenDoc.remove({ user: mongoose.Types.ObjectId(user.id) });

    await this.tokenDoc.create({
      token: refreshToken,
      user: user.id,
      type: TokenType[TokenType.refresh],
      expiration: refreshTokenExpiration.toDate(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async removeRefreshToken(userId: string) {
    const tokenDoc = await this.tokenDoc.findOne({
      user: userId,
      type: TokenType[TokenType.refresh],
    });
    if (!tokenDoc) {
      throw new NotFoundException('Account not found');
    }
    return await tokenDoc.remove();
  }

  // Verify Token
  // Failed if token isExpired or not have refresh token in storage
  async verifyToken(payload: any) {
    const isExpired = moment.unix(payload.exp).isBefore(moment());
    if (isExpired) {
      const tokenDoc = await this.tokenDoc.findOne({
        user: payload.sub,
        type: TokenType[TokenType.refresh],
      });
      await tokenDoc?.remove();
      throw new UnauthorizedException('');
    } else {
      const tokenDoc = await this.tokenDoc.findOne({
        user: payload.sub,
        type: TokenType[TokenType.refresh],
      });
      if (!tokenDoc) throw new UnauthorizedException('');
    }
  }

  _signToken(
    userId: string,
    tokenType: TokenType,
    expiresIn: moment.Moment,
    options?: JwtSignOptions,
  ): string {
    return this.jwtService.sign(
      {
        sub: userId,
        tokenType: TokenType[tokenType],
        exp: expiresIn.unix(),
        iat: moment().unix(),
      },
      Object.assign({ secret: this.config.jwtSecret }, { ...options }),
    );
  }
}
