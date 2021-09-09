import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop, DocumentType } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { RoleEnum } from 'src/common/constant/roles';
import toJson from 'src/database/plugin/toJson';
import { BaseClass } from '../../base/entities/base.entity';

@plugin(toJson, ['createdAt'])
export class Role extends BaseClass {
  @ApiProperty()
  @prop({ type: Schema.Types.ObjectId })
  id: Schema.Types.ObjectId;

  @ApiProperty()
  @prop({ required: true, unique: true, enum: RoleEnum })
  name: RoleEnum;
}

export type RoleDoc = DocumentType<Role>;
