import { Module } from '@nestjs/common';
import { AdminController } from 'src/module/admin/controllers/admin.controller';
import { UserModule } from '../user/user.module';
import { AdminService } from './services/admin.service';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
