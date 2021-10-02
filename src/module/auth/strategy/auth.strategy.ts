import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/common/config/config.service';
import { UserService } from 'src/module/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly config: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtAccessSecret,
      passReqToCallback: true,
    });
  }

  private getAccessTokenFromHeader(bearerToken: string): string {
    return bearerToken.split('Bearer ')[1];
  }

  async validate(request: Request, payload: any) {
    const { sub: userId } = payload;
    const accessToken = this.getAccessTokenFromHeader(
      request.headers['authorization'],
    );

    if (!(await this.authService.isValidAccessToken(userId, accessToken))) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findUserById(userId);
    return user;
  }
}
