import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop, Ref, ReturnModelType } from '@typegoose/typegoose';
import paginate from 'src/database/plugin/paginate';
import toJson from 'src/database/plugin/toJson';
import { ProductType } from 'src/module/product-type/entities/product-type.entity';

@plugin(toJson)
export class Product {
  @prop({ required: true, unique: true })
  @ApiProperty()
  name: string;

  @prop({ required: true })
  @ApiProperty()
  images: string[];

  @prop()
  @ApiProperty()
  description: string;

  @prop({ required: true })
  @ApiProperty()
  price: number;

  @ApiProperty()
  id: string;

  @prop({ required: true, ref: () => ProductType })
  @ApiProperty()
  type: Ref<ProductType>;

  public static paginate(
    this: ReturnModelType<typeof Product>,
    filter,
    options,
  ) {
    return paginate.call(this, filter, options);
  }
}
