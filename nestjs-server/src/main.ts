// ./src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Kích hoạt CORS
  app.enableCors();
  
  await app.listen(3333);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();