import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserDocument } from 'src/module/user/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.authService.authenticateWithEmailAndPassword(
      email,
      password,
    );

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    return user;
  }
}
