import { Module } from '@nestjs/common';
import { RoleService } from './services/roles.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Role } from './enitties/roles.entity';
import { RoleController } from './controllers/role.controller';

@Module({
  imports: [TypegooseModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
