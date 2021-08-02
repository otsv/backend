import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  MONGO_URL: Joi.string().required(),
  PORT: Joi.string().required(),
  NODE_ENV: Joi.string().required().valid('development', 'production'),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().required(),
  ACCOUNTS_SEEDER: Joi.string().default('false'),
});
