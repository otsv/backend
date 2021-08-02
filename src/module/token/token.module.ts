import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { AppConfigService } from 'src/common/config/config.service';
import { TokenSchema } from './token.entity';
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
    MongooseModule.forFeature([
      {
        name: 'Token',
        schema: TokenSchema,
      },
    ]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
