import { CustomHelpers } from 'joi';

export const password = function (value: string, helper: CustomHelpers) {
  if (value.length < 8) return helper.error('password.notEnoughLength');
  return value;
};
