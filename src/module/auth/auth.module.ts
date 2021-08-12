import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from 'src/common/config/config.module';
import { AuthController } from 'src/controller/auth/auth.controller';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { TokenModule } from '../token/token.module';
import { UserSchema } from '../user/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './strategy/auth.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtAuthStrategy],
  imports: [
    PassportModule,
    AppConfigModule,
    TokenModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}