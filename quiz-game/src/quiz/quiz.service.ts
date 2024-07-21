import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizGameInput } from './dto/create-quiz.input';
import { UpdateQuizGameInput } from './dto/update-quiz.input';

@Injectable()
export class QuizGameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizGameInput: CreateQuizGameInput) {
    return await this.prisma.quizGame.create({
      data: createQuizGameInput,
    });
  }

  async findAll() {
    return await this.prisma.quizGame.findMany({
      include: { questions: true },
    });
  }

  async findOne(id: number) {
    return await this.prisma.quizGame.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  async update(id: number, updateQuizGameInput: UpdateQuizGameInput) {
    return await this.prisma.quizGame.update({
      where: { id },
      data: updateQuizGameInput,
    });
  }

  async remove(id: number) {
    return await this.prisma.quizGame.delete({
      where: { id },
    });
  }
}
