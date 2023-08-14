import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

// Validation
  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new DocumentBuilder()
      .setTitle("Gym Sync")
      .setDescription("The Gym Sync API description")
      .setVersion("0.1")
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger-ui", app, document);

  await app.listen(3000);
  Logger.log(
      `🚀 Application is running on: http://localhost:${3000}`
  );
}
bootstrap();
