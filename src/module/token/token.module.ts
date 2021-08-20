import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { AppConfigService } from 'src/common/config/config.service';
import { Token } from './entities/token.entity';
import { TokenService } from './token.service';

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      useFactory: async (config: AppConfigService) => ({
        secret: config.jwtSecret,
        verifyOptions: { ignoreExpiration: false },
      }),
      imports: [AppConfigModule],
      inject: [AppConfigService],
    }),
    TypegooseModule.forFeature([Token]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
