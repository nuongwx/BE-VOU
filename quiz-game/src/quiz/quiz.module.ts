import { Module } from '@nestjs/common';
import { QuizGameService } from './quiz.service';
import { QuizGameResolver } from './quiz.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [QuizGameResolver, QuizGameService, PrismaService],
})
export class QuizModule {}
