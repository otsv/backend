import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop, Ref, ReturnModelType } from '@typegoose/typegoose';
import { OrderState } from 'src/common/constant/order-status';
import paginate from 'src/database/plugin/paginate';
import toJson from 'src/database/plugin/toJson';
import { User } from 'src/module/user/entities/user.entity';
import { OrderItem } from './order-item.entity';

@plugin(toJson)
// eslint-disable-next-line @typescript-eslint/no-var-requires
@plugin(require('mongoose-autopopulate'))
export class Order {
  @ApiProperty()
  id: string;

  @prop({ required: true })
  @ApiProperty({ type: [OrderItem], isArray: true })
  items: OrderItem[];

  @prop({ required: true, ref: () => User })
  @ApiProperty()
  userId: Ref<User>;

  @prop()
  @ApiProperty()
  notes: string;

  @prop({
    required: true,
    enum: OrderState,
  })
  @ApiProperty({ enum: OrderState })
  status: OrderState;

  public static paginate(this: ReturnModelType<typeof Order>, filter, options) {
    return paginate.call(this, filter, options);
  }
}
