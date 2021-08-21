import { plugin, prop, ReturnModelType } from '@typegoose/typegoose';
import paginate from 'src/database/plugin/paginate';
import toJson from 'src/database/plugin/toJson';

@plugin(toJson)
export class Product {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true })
  images: string[];

  @prop()
  description: string;

  @prop({ required: true })
  price: number;

  public static paginate(
    this: ReturnModelType<typeof Product>,
    filter,
    options,
  ) {
    return paginate.call(this, filter, options);
  }
}
