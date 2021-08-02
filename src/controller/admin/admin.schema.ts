import * as Joi from 'joi';
import { Role } from 'src/common/constant/roles';
import { password } from 'src/pipe/custom.validation';

export const createUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().custom(password),
  role: Joi.string()
    .required()
    .valid(...Object.keys(Role)),
  name: Joi.string().required(),
});
