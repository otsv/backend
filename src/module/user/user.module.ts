import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { UserController } from 'src/controller/user.controller';
import { RoleModule } from '../roles/roles.module';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [AppConfigModule, RoleModule, TypegooseModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
