import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuestionInput: CreateQuestionInput) {
    return await this.prisma.quizGameQuestion.create({
      data: createQuestionInput,
    });
  }

  async findAll() {
    return await this.prisma.quizGameQuestion.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.quizGameQuestion.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateQuestionInput: UpdateQuestionInput) {
    return await this.prisma.quizGameQuestion.update({
      where: { id },
      data: updateQuestionInput,
    });
  }

  async remove(id: number) {
    return await this.prisma.quizGameQuestion.delete({
      where: { id },
    });
  }
}
