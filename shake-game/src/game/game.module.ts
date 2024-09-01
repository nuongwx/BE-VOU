import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'VOUCHER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'voucher_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'SHAKE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'shake_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [GameResolver, GameService],
})
export class GameModule {}
