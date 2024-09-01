import { Module } from '@nestjs/common';
import { QuizGameService } from './quiz.service';
import { QuizGameResolver } from './quiz.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
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
    ]),
  ],
  providers: [QuizGameResolver, QuizGameService],
})
export class QuizModule {}
