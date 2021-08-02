import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { TokenType } from 'src/common/constant/token';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    enum: [TokenType[(TokenType.access, TokenType.refresh)]],
  })
  type: string;

  @Prop({ required: true })
  expiration: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
