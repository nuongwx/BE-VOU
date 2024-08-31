import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { QuestionGateway } from './question.gateway';
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
  providers: [QuestionResolver, QuestionService, QuestionGateway],
})
export class QuestionModule {}
