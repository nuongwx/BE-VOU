import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(3001);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'quiz_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

  microservice.listen();

  console.log('Quiz Microservice is listening');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`GraphQL Playground: ${await app.getUrl()}/graphql`);
}

bootstrap();
