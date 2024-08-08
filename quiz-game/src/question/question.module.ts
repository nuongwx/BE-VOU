import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { QuestionGateway } from './question.gateway';

@Module({
  providers: [
    QuestionResolver,
    QuestionService,
    PrismaService,
    QuestionGateway,
  ],
})
export class QuestionModule {}
