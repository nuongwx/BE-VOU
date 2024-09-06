import { Module } from '@nestjs/common';
import { QuizGameService } from './quiz.service';
import { QuizGameResolver } from './quiz.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QuizController } from './quiz.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAIModule } from '../openai/openai.module';
import { FluentFfmpegModule } from '@mrkwskiti/fluent-ffmpeg-nestjs';
import { dIdModule } from '../d-id/d-id.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'VOUCHER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'voucher_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    OpenAIModule,
    FluentFfmpegModule.forRoot(),
    dIdModule,
  ],
  controllers: [QuizController],
  providers: [QuizGameResolver, QuizGameService],
  exports: [QuizGameService],
})
export class QuizModule {}
