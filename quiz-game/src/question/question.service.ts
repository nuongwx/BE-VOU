import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { QuizGameAnswerEntity } from '../answer/entities/answer.entity';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuestionInput: CreateQuestionInput) {
    try {
      const { answers, correctAnswerId, quizGameId, ...questionData } =
        createQuestionInput;

      const createdQuestion = await this.prisma.quizGameQuestion.create({
        data: {
          ...questionData,
          quizGames: {
            connect: { id: quizGameId },
          },
          answers: {
            create: answers.map((answer) => ({
              content: answer.content,
              image: answer.image,
            })),
          },
          correctAnswer: {
            connect: { id: correctAnswerId },
          },
        },
        include: {
          answers: true,
        },
      });

      return createdQuestion;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating question');
    }
  }

  async findAll() {
    return await this.prisma.quizGameQuestion.findMany({
      where: { isDeleted: false },
      include: {
        answers: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.quizGameQuestion.findUnique({
      where: { id: id, isDeleted: false },
      include: {
        answers: true,
      },
    });
  }

  async update(id: number, updateQuestionInput: UpdateQuestionInput) {
    try {
      const { answers, correctAnswerId, quizGameId, ...questionData } =
        updateQuestionInput;

      const updatedQuestion = await this.prisma.quizGameQuestion.update({
        where: { id: id, isDeleted: false },
        data: {
          content: questionData.content,
          images: questionData.images ? { set: questionData.images } : null,
          quizGames: quizGameId ? { connect: { id: quizGameId } } : null,
          correctAnswer: correctAnswerId
            ? { connect: { id: correctAnswerId } }
            : null,
        },
        include: {
          answers: true,
        },
      });

      if (answers) {
        for (const answer of answers) {
          if (answer.id) {
            await this.prisma.quizGameAnswer.update({
              where: { id: answer.id },
              data: {
                content: answer.content,
                image: answer.image,
              },
            });
          } else {
            await this.prisma.quizGameAnswer.create({
              data: {
                content: answer.content,
                image: answer.image,
                questionId: updatedQuestion.id,
              },
            });
          }
        }
      }

      return updatedQuestion;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error updating question');
    }
  }

  async remove(id: number) {
    const result = await this.prisma.quizGameQuestion.update({
      where: { id },
      data: { isDeleted: true },
      select: { answers: true },
    });

    return result;
  }

  async generateRandomQuestions(length: number) {
    try {
      const allQuestions = await this.prisma.quizGameQuestion.findMany({
        where: { isDeleted: false },
        select: {
          answers: true,
        },
      });

      if (length > allQuestions.length) {
        throw new Error(
          'Requested length exceeds the number of available questions',
        );
      }

      const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
      return shuffledQuestions.slice(0, length);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error generating random questions',
      );
    }
  }

  async checkAnswer(questionId: number, answer: QuizGameAnswerEntity) {
    try {
      const question = await this.prisma.quizGameQuestion.findUnique({
        where: { id: questionId, isDeleted: false },
      });

      if (!question) {
        throw new NotFoundException('Question not found');
      }

      return question.correctAnswerId === answer.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error checking answer');
    }
  }
}
