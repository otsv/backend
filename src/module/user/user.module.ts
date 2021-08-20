import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [AppConfigModule, TypegooseModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
