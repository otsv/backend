import * as bcrypt from 'bcrypt';
import validator from 'validator';
import { Role } from 'src/common/constant/roles';
import { plugin, pre, prop, ReturnModelType } from '@typegoose/typegoose';
import toJson from 'src/database/plugin/toJson';
import paginate from 'src/database/plugin/paginate';

@pre<User>('save', async function () {
  if (this.isModified('password')) {
    this.set('password', await bcrypt.hash(this.get('password'), 8));
  }
})
@plugin(toJson)
export class User {
  @prop()
  name: string;

  @prop({
    required: true,
    unique: true,
    validate: {
      message: 'Not a valid email address',
      validator: (value) => validator.isEmail(value),
    },
  })
  email: string;

  @prop({ required: true, private: true })
  password: string;

  @prop({
    required: true,
    enum: [Role[Role.admin], Role[Role.adminCafeteria], Role[Role.staff]],
  })
  role: string;

  public static paginate(this: ReturnModelType<typeof User>, filter, options) {
    return paginate.call(this, filter, options);
  }
}
