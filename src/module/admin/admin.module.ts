import { Module } from '@nestjs/common';
import { AdminController } from 'src/controller/admin.controller';
import { UserModule } from '../user/user.module';
import { AdminService } from './admin.service';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
