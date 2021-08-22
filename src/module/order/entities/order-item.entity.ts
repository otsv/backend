import { ApiProperty } from '@nestjs/swagger';
import { prop, Ref } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

import { Product } from 'src/module/product/entities/product.entity';

export class OrderItem {
  @prop({ required: true })
  @ApiProperty()
  quantity: number;

  @prop({
    required: true,
    ref: () => Product,
    type: () => Schema.Types.ObjectId,
  })
  @ApiProperty()
  product: Ref<Product>;
}
