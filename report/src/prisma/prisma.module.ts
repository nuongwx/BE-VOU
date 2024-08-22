import { Global, Module } from '@nestjs/common';
import {
  EventService,
  PrismaService,
  QuizService,
  ShakeService,
  UserService,
} from './prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    QuizService,
    ShakeService,
    EventService,
    UserService,
  ],
  exports: [
    PrismaService,
    QuizService,
    ShakeService,
    EventService,
    UserService,
  ],
})
export class PrismaModule {}
