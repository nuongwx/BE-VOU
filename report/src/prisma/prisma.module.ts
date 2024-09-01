import { Global, Module } from '@nestjs/common';
import {
  EventService,
  QuizService,
  ShakeService,
  UserService,
} from './prisma.service';

@Global()
@Module({
  providers: [QuizService, ShakeService, EventService, UserService],
  exports: [QuizService, ShakeService, EventService, UserService],
})
export class PrismaModule {}
