import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QUIZ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://ngwx:1@ngwx.mooo.com:5672/default'],
          queue: 'quiz-queue',
        },
      },
    ]),
  ],
  providers: [ProducerService],
})
export class ProducerModule {}
