import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ExcludeNullInterceptor } from './interceptors/exclude.null.interceptor';
import * as exphbs from 'express-handlebars';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api');
  //Global Loging Interceptor & TransformInterceptor & ExcludeNullInterceptor
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new ExcludeNullInterceptor(),
  );
  //validation pipe
  //app.useGlobalPipes(new ValidationPipe());
  //Global Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result: Record<string, string> = {};
        errors.forEach((error) => {
          result[error.property] = Object.values(error.constraints).join(', ');
        });
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );
  app.engine('hbs', exphbs({ extname: 'hbs' }));

  app.setViewEngine('hbs');
  const port = process.env.Port;
  await app.listen(port);
}
bootstrap();
