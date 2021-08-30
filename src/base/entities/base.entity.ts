import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';
import { User } from '../../module/user/entities/user.entity';

@plugin(autopopulate as any)
export class BaseClass {
  @ApiProperty()
  @prop({ type: Schema.Types.Date, default: Date.now() })
  createdAt: Date;

  @ApiProperty()
  @prop({ type: Schema.Types.Date })
  updatedAt: Date;

  @ApiProperty()
  @prop({ type: Schema.Types.Date })
  deletedAt: Date;

  @ApiProperty()
  @prop({ type: Schema.Types.ObjectId, ref: () => User, autopopulate: true })
  createdBy: Schema.Types.ObjectId | User;

  @ApiProperty()
  @prop({ type: Schema.Types.ObjectId, ref: () => User, autopopulate: true })
  updatedBy: Schema.Types.ObjectId | User;

  @ApiProperty()
  @prop({ type: Schema.Types.ObjectId, ref: () => User, autopopulate: true })
  deletedBy: Schema.Types.ObjectId | User;
}
