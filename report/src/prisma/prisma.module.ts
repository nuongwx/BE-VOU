import { Global, Module } from '@nestjs/common';
import {
  EventService,
  QuizService,
  ShakeService,
  UserService,
  VoucherService,
} from './prisma.service';

@Global()
@Module({
  providers: [QuizService, ShakeService, EventService, VoucherService, UserService],
  exports: [QuizService, ShakeService, EventService, VoucherService, UserService],
})
export class PrismaModule {}
