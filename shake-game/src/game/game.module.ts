import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GameController } from './game.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'VOUCHER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://ngwx:1@ngwx.mooo.com:5672/default'],
          queue: 'voucher_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [GameController],
  providers: [GameResolver, GameService],
})
export class GameModule {}
