import { Module } from '@nestjs/common';
import { QuizGameService } from './quiz.service';
import { QuizGameResolver } from './quiz.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QuizGameResolver, QuizGameService],
})
export class QuizModule {}
