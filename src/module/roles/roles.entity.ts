import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import toJson from 'src/database/plugin/toJson';
import { BaseClass } from '../../base/entities/base.entity';

@plugin(toJson, ['createdAt'])
export class Role extends BaseClass {
  @ApiProperty()
  @prop({ type: Schema.Types.ObjectId })
  id: Schema.Types.ObjectId;

  @ApiProperty()
  @prop({ required: true, unique: true, enum: Role })
  name: string;
}
