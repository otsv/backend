import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AppConfigService } from 'src/common/config/config.service';
import { TokenType } from 'src/common/constant/token';
import { TokenService } from 'src/module/token/token.service';
import { User } from 'src/module/user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly config: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: any): Promise<User> {
    await this.tokenService.verifyToken(payload);
    if (payload.tokenType !== TokenType[TokenType.access]) {
      throw new UnauthorizedException('not a access token');
    }
    const user = await this.authService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
