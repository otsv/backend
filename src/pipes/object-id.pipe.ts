import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

export class ParseObjectId implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isValidObjectId = Types.ObjectId.isValid(value);

    if (!isValidObjectId) {
      throw new BadRequestException('Invalid Object Id');
    }

    return value;
  }
}
