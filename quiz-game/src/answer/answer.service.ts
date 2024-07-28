import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnswerInput: CreateAnswerInput) {
    return await this.prisma.quizGameAnswer.create({
      data: createAnswerInput,
    });
  }

  async findAll() {
    return await this.prisma.quizGameAnswer.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.quizGameAnswer.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateAnswerInput: UpdateAnswerInput) {
    return await this.prisma.quizGameAnswer.update({
      where: { id },
      data: updateAnswerInput,
    });
  }

  async remove(id: number) {
    return await this.prisma.quizGameAnswer.delete({
      where: { id },
    });
  }
}
