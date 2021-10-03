import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop, Ref, ReturnModelType } from '@typegoose/typegoose';
import { BaseEntity } from 'src/module/shared/entities/base.entity';
import { ProductStatus } from 'src/module/product/constants/product.constant';
import paginate from 'src/database/mongo/plugin/paginate';
import toJson from 'src/database/mongo/plugin/toJson';
import { Category } from '../../category/entities/category.entity';

@plugin(toJson)
// eslint-disable-next-line @typescript-eslint/no-var-requires
@plugin(require('mongoose-autopopulate'))
export class Product extends BaseEntity {
  @prop({ required: true, unique: true })
  @ApiProperty()
  name: string;

  @prop({ default: [] })
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

  @prop({ required: true, default: ProductStatus.inStock })
  @ApiProperty({ enum: ProductStatus })
  status: ProductStatus;

  @prop({ required: true, ref: () => Category, autopopulate: true })
  @ApiProperty()
  type: Ref<Category>;

  public static paginate(
    this: ReturnModelType<typeof Product>,
    filter,
    options,
  ) {
    return paginate.call(this, filter, options);
  }
}
