import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { AuthController } from 'src/controller/auth.controller';
import { TokenModule } from '../token/token.module';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './strategy/auth.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtAuthStrategy],
  imports: [
    PassportModule,
    AppConfigModule,
    TokenModule,
    TypegooseModule.forFeature([User]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
