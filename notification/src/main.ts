/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const microserviceTcp = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: {
  //     host: 'localhost',
  //     port: 3008,
  //   },
  // });

  const configService = app.get(ConfigService);

  const microserviceRabbitmq = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'notification_queue',
    },
  });

  // const gprc = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'app',
  //     protoPath: 'src/app.proto',
  //   },
  // });

  await app.startAllMicroservices();
  await app.listen(3007);
}
bootstrap();
