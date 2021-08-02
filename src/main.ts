import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './common/config/config.service';
import { UserService } from './module/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.get(UserService).seedAccounts();
  const config = app.get(AppConfigService);
  await app.listen(config.port);
}
bootstrap();
