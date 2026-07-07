import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  // Request validation is Zod-based (ZodValidationPipe + @drivewise/contracts),
  // applied per-route — no class-validator global pipe needed.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  });

  const port = Number(process.env.PORT) || 8000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`DriveWise API listening on http://localhost:${port}/api/v1`);
}

bootstrap();
