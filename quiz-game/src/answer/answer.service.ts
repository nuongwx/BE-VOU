import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnswerInput: CreateAnswerInput) {
    try {
      return await this.prisma.quizGameAnswer.create({
        data: createAnswerInput,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating answer');
    }
  }

  async findAll() {
    try {
      return await this.prisma.quizGameAnswer.findMany({
        where: { isDeleted: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving answers');
    }
  }

  async findOne(id: number) {
    try {
      const answer = await this.prisma.quizGameAnswer.findUnique({
        where: { id: id, isDeleted: false },
      });

      if (!answer) {
        throw new NotFoundException('Answer not found');
      }

      return answer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving answer');
    }
  }

  async update(id: number, updateAnswerInput: UpdateAnswerInput) {
    try {
      const existingAnswer = await this.prisma.quizGameAnswer.findUnique({
        where: { id: id, isDeleted: false },
      });

      if (!existingAnswer) {
        throw new NotFoundException('Answer not found');
      }

      return await this.prisma.quizGameAnswer.update({
        where: { id },
        data: updateAnswerInput,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating answer');
    }
  }

  async remove(id: number) {
    try {
      const existingAnswer = await this.prisma.quizGameAnswer.findUnique({
        where: { id },
      });

      if (!existingAnswer) {
        throw new NotFoundException('Answer not found');
      }

      return await this.prisma.quizGameAnswer.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error removing answer');
    }
  }

  async assignAnswerToQuestion(questionId: number, answerId: number) {
    try {
      const existingQuestion = await this.prisma.quizGameQuestion.findUnique({
        where: { id: questionId, isDeleted: false },
      });

      if (!existingQuestion) {
        throw new NotFoundException('Question not found');
      }

      const existingAnswer = await this.prisma.quizGameAnswer.findUnique({
        where: { id: answerId, isDeleted: false },
      });

      if (!existingAnswer) {
        throw new NotFoundException('Answer not found');
      }

      return await this.prisma.quizGameQuestion.update({
        where: { id: questionId },
        data: {
          answers: {
            connect: { id: answerId },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error assigning answer to question',
      );
    }
  }
}
