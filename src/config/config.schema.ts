import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  MONGO_URL: Joi.string().required(),
});
