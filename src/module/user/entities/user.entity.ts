import { ApiProperty } from '@nestjs/swagger';
import {
  plugin,
  pre,
  prop,
  ReturnModelType,
  DocumentType,
  Ref,
} from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { RoleEnum } from 'src/common/constant/roles';
import paginate from 'src/database/plugin/paginate';
import toJson from 'src/database/plugin/toJson';
import { Role } from 'src/module/roles/roles.entity';
import validator from 'validator';
import * as autopopulate from 'mongoose-autopopulate';
import { UserStatus } from '../../../common/constant/user-status';

@pre<User>('save', async function () {
  if (this.isModified('password')) {
    this.set('password', await bcrypt.hash(this.get('password'), 8));
  }
})
@plugin(toJson, autopopulate)
export class User {
  @ApiProperty()
  id: string;

  @prop()
  @ApiProperty()
  name: string;

  @prop({
    required: true,
    unique: true,
    validate: {
      message: 'Not a valid email address',
      validator: (value) => validator.isEmail(value),
    },
  })
  @ApiProperty()
  email: string;

  @prop({ required: true, private: true })
  password: string;

  @prop()
  avatar: string;

  @prop({ required: true, default: 1 })
  dailyBalance: number;

  @prop()
  phone: string;

  @prop({
    required: true,
    type: Schema.Types.ObjectId,
    ref: () => Role,
    autopopulate: true,
  })
  @ApiProperty({ enum: RoleEnum })
  role: Ref<Role>;

  @prop({ required: true, default: UserStatus.activate })
  @ApiProperty({ enum: UserStatus, default: UserStatus.activate })
  status: UserStatus;

  public static paginate(this: ReturnModelType<typeof User>, filter, options) {
    return paginate.call(this, filter, options);
  }

  public static findByUserId(
    this: ReturnModelType<typeof User>,
    userId: string,
  ) {
    return this.findById(userId);
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export type UserDoc = DocumentType<User>;
