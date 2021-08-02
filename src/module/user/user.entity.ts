import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import validator from 'validator';
import { Role } from 'src/common/constant/roles';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      message: 'Not a valid email address',
      validator: (value) => validator.isEmail(value),
    },
  })
  email: string;

  @Prop({ required: true, private: true })
  password: string;

  @Prop({
    required: true,
    enum: [Role[Role.admin], Role[Role.adminCafeteria], Role[Role.staff]],
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.set('password', await bcrypt.hash(this.get('password'), 8));
  }
  next();
});
