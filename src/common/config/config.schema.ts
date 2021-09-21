import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

class EnvironmentSchema {
  @IsString()
  MONGO_URL: string;

  @IsNumber()
  PORT: number;

  @IsIn(['development', 'production'])
  NODE_ENV: string;

  //JWT
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsNumber()
  JWT_ACCESS_EXPIRATION: number;

  @IsNumber()
  JWT_REFRESH_EXPIRATION: number;

  //Seeder
  @IsBoolean()
  ACCOUNTS_SEEDER: boolean;

  @IsBoolean()
  CATEGORY_SEEDER: boolean;

  //Mongo
  @IsString()
  MONGO_INITDB_ROOT_USERNAME: string;

  @IsString()
  MONGO_INITDB_ROOT_PASSWORD: string;

  @IsString()
  MONGO_INITDB_DATABASE: string;

  //Redis
  @IsString()
  REDIS_HOST: string;

  @IsString()
  REDIS_PORT: string;

  @IsString()
  REDIS_PASSWORD: string;

  @IsString()
  REDIS_DB: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentSchema, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
