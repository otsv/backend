import { ApiProperty } from '@nestjs/swagger';
import { index, prop } from '@typegoose/typegoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { OrderItem } from './order-item.entity';

@index({ accountEmail: 1, date: -1 })
export class OrderItemManager extends BaseEntity {
  @prop({
    required: true,
  })
  @ApiProperty()
  accountEmail: string;

  @prop({
    required: true,
  })
  @ApiProperty()
  date: Date;

  @prop({
    required: true,
  })
  @ApiProperty()
  items: OrderItem[];

  @prop({
    required: true,
    default: 0,
  })
  @ApiProperty()
  totalItems: number;

  @prop({
    required: true,
    default: 0,
  })
  @ApiProperty()
  totalPrice: number;
}
