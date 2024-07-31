import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'NOTIFICATION_SERVICE_TCP',
    //     transport: Transport.TCP,
    //     options: {
    //       port: 3001,
    //     },
    //   },
    //   {
    //     name: 'NOTIFICATION_SERVICE_RMQ',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://ngwx:1@ngwx.mooo.com:5672/default'],
    //       queue: 'rabbit-mq',
    //     },
    //   },
    //   {
    //     name: 'NOTIFICATION_SERVICE_GRPC',
    //     transport: Transport.GRPC,
    //     options: {
    //       package: 'app',
    //       protoPath: 'src/app.proto',
    //     },
    //   },
    // ]),
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
