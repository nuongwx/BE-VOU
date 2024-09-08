import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // });

  const configService = app.get(ConfigService);

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'event_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  microservice.listen();

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
