import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app';
import { AppConfigService } from './common/config/config.service';
import { SeedService } from './database/seed/seed.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as info from 'package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.get(SeedService).seed();
  buildSwagger(app);
  const config = app.get(AppConfigService);
  await app.listen(config.port);
}
bootstrap();

function buildSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(info.name)
    .setDescription(info.description)
    .setVersion(info.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
