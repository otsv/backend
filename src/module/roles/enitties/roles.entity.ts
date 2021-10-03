import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop, DocumentType } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { RoleType } from 'src/module/roles/constants';
import toJson from 'src/database/mongo/plugin/toJson';
import { BaseEntity } from '../../shared/entities/base.entity';

@plugin(toJson, ['createdAt'])
export class Role extends BaseEntity {
  @ApiProperty()
  @prop({ type: Schema.Types.ObjectId })
  id: Schema.Types.ObjectId;

  @ApiProperty()
  @prop({ required: true, unique: true, enum: RoleType })
  name: RoleType;
}

export type RoleDoc = DocumentType<Role>;
