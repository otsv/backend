import { ApiProperty } from '@nestjs/swagger';
import { plugin, prop } from '@typegoose/typegoose';
import toJson from 'src/database/mongo/plugin/toJson';

@plugin(toJson)
export class Category {
  @prop({ required: true, unique: true })
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;
}
