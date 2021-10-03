import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { AuthController } from 'src/module/auth/controllers/auth.controller';
import { User } from 'src/module/user/entities/user.entity';
import { AuthService } from './services/auth.service';
import { JwtAuthStrategy } from './strategy/auth.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { RedisModule } from 'src/database/redis/redis.module';
import { UserModule } from 'src/module/user';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'src/common/config';

@Module({
  providers: [AuthService, LocalStrategy, JwtAuthStrategy],
  imports: [
    PassportModule,
    AppConfigModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => ({
        signOptions: {
          expiresIn: config.jwtAccessExpiration,
        },
      }),
    }),
    RedisModule,
    TypegooseModule.forFeature([User]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
