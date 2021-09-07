import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { AuthController } from 'src/controller/auth.controller';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './strategy/auth.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'src/common/config/config.service';

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
