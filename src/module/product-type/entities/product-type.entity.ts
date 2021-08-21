import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop } from '@typegoose/typegoose';
import toJson from 'src/database/plugin/toJson';

@plugin(toJson)
export class ProductType {
  @prop({ required: true, unique: true })
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;
}
