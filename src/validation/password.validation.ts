import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customPassword', async: false })
export class PasswordContains implements ValidatorConstraintInterface {
  validate(
    value: string,
    _validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (!value) return false;
    return value.length > 6 && value.length < 32;
  }
  defaultMessage?(_validationArguments?: ValidationArguments): string {
    return 'Password is too short or too long';
  }
}
