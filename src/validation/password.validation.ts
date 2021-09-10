import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customPassword', async: false })
export class PasswordContains implements ValidatorConstraintInterface {
  validate(
    password: string,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (!password || !password.trim()) return false;

    return password.length > 6 && password.length < 32;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'Password is too short or too long';
  }
}
