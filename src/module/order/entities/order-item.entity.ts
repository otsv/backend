import { ApiProperty } from '@nestjs/swagger';
import { index, plugin, prop, ReturnModelType } from '@typegoose/typegoose';
import { BaseEntity } from 'src/module/shared/entities/base.entity';
import { OrderItemStatus } from 'src/module/product/constants/product.constant';
import paginate from 'src/database/mongo/plugin/paginate';
import toJson from 'src/database/mongo/plugin/toJson';
import { Product } from 'src/module/product/entities/product.entity';

@plugin(toJson)
@index({ createdAt: -1, accountEmail: 1 })
export class OrderItem extends BaseEntity {
  @prop({
    required: true,
  })
  @ApiProperty()
  product: Product;

  @prop({
    required: true,
    enum: OrderItemStatus,
    default: OrderItemStatus.new,
  })
  @ApiProperty({ enum: OrderItemStatus })
  status: OrderItemStatus;

  @prop({
    required: true,
  })
  @ApiProperty()
  accountEmail: string;

  @prop()
  @ApiProperty()
  note: string;

  @prop({ required: true, default: 1 })
  @ApiProperty()
  quantity: number;

  public static paginate(
    this: ReturnModelType<typeof OrderItem>,
    filter,
    options,
  ) {
    return paginate.call(this, filter, options);
  }
}
