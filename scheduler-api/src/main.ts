import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import {BadRequestException, Logger, ValidationError, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

// Validation
  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          console.error(JSON.stringify(validationErrors));
          return new BadRequestException(validationErrors);
        },
        transform: true,
      }),
  );

  const config = new DocumentBuilder()
      .setTitle("Gym Sync")
      .setDescription("The Gym Sync API description")
      .setVersion("0.1")
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger-ui", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");
  Logger.log(
      `🚀 Application is running on: http://localhost:${port}`
  );
}
bootstrap();
