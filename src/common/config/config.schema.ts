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

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_ACCESS_EXPIRATION: string;

  @IsString()
  JWT_REFRESH_EXPIRATION: string;

  @IsBoolean()
  ACCOUNTS_SEEDER: boolean;

  @IsBoolean()
  PRODUCTS_SEEDER: boolean;

  @IsBoolean()
  CATEGORY_SEEDER: boolean;
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
