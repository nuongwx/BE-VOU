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

  // const microserviceRabbitmq = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'],
  //     queue: 'voucher_queue',
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`GraphQL Playground: ${await app.getUrl()}/graphql`);
}
bootstrap();
