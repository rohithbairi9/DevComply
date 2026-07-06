import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { json } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // 1. Cookie parser
  app.use(cookieParser());

  // 2. JSON parser with raw body verification (Crucial for Webhook Security)
  app.use(
    json({
      verify: (req: any, res, buffer) => {
        // Save the raw buffer on the request object so our controller can access it
        req.rawBody = buffer;
      },
    }),
  );

  // 3. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 4. CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();