import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizGameInput } from './dto/create-quiz.input';
import { UpdateQuizGameInput } from './dto/update-quiz.input';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class QuizGameService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('VOUCHER_SERVICE') private readonly voucherClient: ClientProxy,
  ) {}

  async create(createQuizGameInput: CreateQuizGameInput) {
    try {
      return await this.prisma.quizGame.create({
        data: createQuizGameInput,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating quiz game');
    }
  }

  async findAll() {
    try {
      return await this.prisma.quizGame.findMany({
        where: { isDeleted: false },
        include: { questions: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error finding quiz games');
    }
  }

  async findOne(id: number) {
    try {
      const quizGame = await this.prisma.quizGame.findUnique({
        where: { id: id, isDeleted: false },
        include: { questions: true },
      });

      if (!quizGame) {
        throw new NotFoundException('Quiz game not found');
      }

      return quizGame;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding quiz game');
    }
  }

  async update(id: number, updateQuizGameInput: UpdateQuizGameInput) {
    try {
      return await this.prisma.quizGame.update({
        where: { id: id, isDeleted: false },
        data: updateQuizGameInput,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating quiz game');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.quizGame.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error removing quiz game');
    }
  }

  async assignQuestionsToQuizGame(quizGameId: number, questionIds: number[]) {
    try {
      const quizGame = await this.prisma.quizGame.findUnique({
        where: { id: quizGameId, isDeleted: false },
      });

      if (!quizGame) {
        throw new NotFoundException('Quiz game not found');
      }

      const questions = await this.prisma.quizGameQuestion.findMany({
        where: { id: { in: questionIds }, isDeleted: false },
      });

      if (questions.length !== questionIds.length) {
        throw new NotFoundException('One or more questions not found');
      }

      return await this.prisma.quizGameQuestionToQuizGameMapping.createMany({
        data: questionIds.map((questionId) => ({
          quizGameId,
          quizQuestionId: questionId,
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error assigning questions to quiz game',
      );
    }
  }

  async removeQuestionFromQuizGame(quizGameId: number, questionId: number) {
    try {
      const quizGame = await this.prisma.quizGame.findUnique({
        where: { id: quizGameId, isDeleted: false },
      });

      if (!quizGame) {
        throw new NotFoundException('Quiz game not found');
      }

      const question = await this.prisma.quizGameQuestion.findUnique({
        where: { id: questionId, isDeleted: false },
      });

      if (!question) {
        throw new NotFoundException('Question not found');
      }

      await this.prisma.quizGameQuestionToQuizGameMapping.deleteMany({
        where: {
          quizGameId,
          quizQuestionId: questionId,
        },
      });

      return { message: 'Question removed from quiz game' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error removing question from quiz game',
      );
    }
  }

  async assignVoucherForWinnerUser(quizGameId: number, userId: number) {
    try {
      const quizGame = await this.prisma.quizGame.findUnique({
        where: { id: quizGameId, isDeleted: false },
        select: { eventId: true },
      });

      if (!quizGame) {
        throw new NotFoundException('Quiz game not found');
      }

      const eventId = quizGame.eventId;

      const result = await firstValueFrom(
        this.voucherClient.send(
          { cmd: 'assign_voucher_to_user' },
          { eventId, userId },
        ),
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error assigning voucher');
    }
  }
}
