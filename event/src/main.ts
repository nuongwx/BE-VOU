import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-minimal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use((req, res, next) => {
    if (req.url === '/graphql') {
      // 10MB
      graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })(req, res, next);
    } else {
      next();
    }
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3005);
}
bootstrap();
