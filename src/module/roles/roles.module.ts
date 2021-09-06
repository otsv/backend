import { Module } from '@nestjs/common';
import { RoleService } from './roles.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Role } from './roles.entity';
import { RoleController } from '../../controller/role.controller';

@Module({
  imports: [TypegooseModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
