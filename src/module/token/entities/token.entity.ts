import { plugin, prop, Ref } from '@typegoose/typegoose';
import { TokenType } from 'src/common/constant/token';
import toJson from 'src/database/plugin/toJson';
import { User } from 'src/module/user/entities/user.entity';
@plugin(toJson)
export class Token {
  @prop({ required: true })
  token: string;

  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({
    required: true,
    enum: [TokenType[(TokenType.access, TokenType.refresh)]],
  })
  type: string;

  @prop({ required: true })
  expiration: Date;
}
