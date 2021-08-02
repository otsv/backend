import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { UserSchema } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
