import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { errorMessage } from 'src/common/constant/validation_error';

@Injectable()
export class RequestValidation implements PipeTransform {
  constructor(private readonly objectSchema: ObjectSchema) {}
  transform(value: any) {
    const { error, value: result } = this.objectSchema
      .prefs({
        abortEarly: false,
        errors: { label: 'key' },
      })
      .messages(errorMessage)
      .validate(value);

    if (error) {
      throw new BadRequestException(
        'Validation failed',
        error.details.map((e) => e.message).join(', '),
      );
    }

    return result;
  }
}
