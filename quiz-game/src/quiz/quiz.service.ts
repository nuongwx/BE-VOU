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
import { InjectFluentFfmpeg, Ffmpeg } from '@mrkwskiti/fluent-ffmpeg-nestjs';
import { OpenAIService } from '../openai/openai.service';
import { DiDService } from '../d-id/d-id.service';
import fs from 'fs';

@Injectable()
export class QuizGameService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('VOUCHER_SERVICE') private readonly voucherClient: ClientProxy,
    private readonly openaiService: OpenAIService,
    @InjectFluentFfmpeg() private readonly ffmpeg: Ffmpeg,
    private readonly dIdService: DiDService,
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

  async findAll(limit?: number, offset?: number) {
    try {
      const quizGames = await this.prisma.quizGame.findMany({
        where: { isDeleted: false },
        include: {
          questions: {
            include: {
              quizGameQuestion: {
                include: {
                  answers: true,
                },
              },
            },
          },
        },
        take: limit ?? undefined,
        skip: offset ?? undefined,
      });

      const flattenedQuizGames = quizGames.map((quizGame) => ({
        ...quizGame,
        questions: quizGame.questions.map((mapping) => ({
          id: mapping.quizGameQuestion.id,
          content: mapping.quizGameQuestion.content,
          images: mapping.quizGameQuestion.images,
          correctAnswerId: mapping.quizGameQuestion.correctAnswerId,
          quizGameId: quizGame.id,
          answers: mapping.quizGameQuestion.answers.map((answer) => ({
            id: answer.id,
            content: answer.content,
            image: answer.image,
            isDeleted: answer.isDeleted,
          })),
        })),
      }));

      return flattenedQuizGames;
    } catch (error) {
      throw new InternalServerErrorException('Error finding quiz games');
    }
  }

  async findOne(id: number) {
    try {
      const quizGame = await this.prisma.quizGame.findUnique({
        where: { id: id, isDeleted: false },
        include: {
          questions: {
            include: {
              quizGameQuestion: {
                include: {
                  answers: true,
                },
              },
            },
          },
        },
      });

      if (!quizGame) {
        throw new NotFoundException('Quiz game not found');
      }

      const flattenedQuestions = quizGame.questions.map((mapping) => ({
        id: mapping.quizGameQuestion.id,
        content: mapping.quizGameQuestion.content,
        images: mapping.quizGameQuestion.images,
        correctAnswerId: mapping.quizGameQuestion.correctAnswerId,
        quizGameId: quizGame.id,
        answers: mapping.quizGameQuestion.answers.map((answer) => ({
          id: answer.id,
          content: answer.content,
          image: answer.image,
          isDeleted: answer.isDeleted,
        })),
      }));

      return {
        ...quizGame,
        questions: flattenedQuestions,
      };
    } catch (error) {
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

      const result =
        await this.prisma.quizGameQuestionToQuizGameMapping.createMany({
          data: questionIds.map((questionId) => ({
            quizGameId,
            quizQuestionId: questionId,
          })),
          skipDuplicates: true,
        });

      return result.count > 0;
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

  async getQuizGameById(id: number) {
    return await this.prisma.quizGame.findUnique({
      where: { id, isDeleted: false },
    });
  }

  async findUnassignedQuizGame() {
    try {
      const quizGames = await this.prisma.quizGame.findMany({
        where: {
          OR: [{ eventId: null }, { eventId: { lt: 0 } }],
          isDeleted: false,
        },
        include: {
          questions: {
            include: {
              quizGameQuestion: {
                include: {
                  answers: true,
                },
              },
            },
          },
        },
      });

      if (!quizGames || quizGames.length === 0) {
        throw new NotFoundException('Quiz game not found');
      }

      const result = quizGames.map((quizGame) => ({
        ...quizGame,
        questions: quizGame.questions.map((mapping) => ({
          id: mapping.quizGameQuestion.id,
          content: mapping.quizGameQuestion.content,
          images: mapping.quizGameQuestion.images,
          correctAnswerId: mapping.quizGameQuestion.correctAnswerId,
          answers: mapping.quizGameQuestion.answers.map((answer) => ({
            id: answer.id,
            content: answer.content,
            image: answer.image,
            isDeleted: answer.isDeleted,
          })),
        })),
      }));

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error finding unassigned quiz game',
      );
    }
  }

  async createAudio(id: number) {
    if (!fs.existsSync('generated')) {
      fs.mkdirSync('generated');
    }

    const questions =
      await this.prisma.quizGameQuestionToQuizGameMapping.findMany({
        where: { quizGameId: id },
        orderBy: { orderIndex: 'asc' },
        include: {
          quizGameQuestion: {
            include: {
              answers: true,
            },
          },
        },
      });

    const QUESTION_AUDIO_DURATION = 10;
    const EXPLAINATION_AUDIO_DURATION = 10;

    const questionsAsks = [];
    const questionsAnswers = [];

    const result_audio: string[] = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      let result = '';
      let counter = 1;
      let answer_counter = 1;

      result += `Question ${i + 1}. ${question.quizGameQuestion.content}`;

      const answers = question.quizGameQuestion.answers;

      answers.forEach((answer) => {
        result += ` ${answer.content}.`;
      });

      questionsAsks.push(result);

      result = '';

      let correctAnswer = answers.find(
        (answer) => answer.id === question.quizGameQuestion.correctAnswerId,
      );

      if (!correctAnswer) {
        correctAnswer = answers[0];
      }

      const correntAnswerIndex = answers.indexOf(correctAnswer);

      result += `The correct answer is [pause] ${String.fromCharCode(
        65 + correntAnswerIndex,
      )} - ${correctAnswer.content}.`;

      questionsAnswers.push(result);
    }

    for (let i = 0; i < questionsAsks.length; i++) {
      console.log('questionsAsks[i]', questionsAsks[i]);
      console.log('questionsAnswers[i]', questionsAnswers[i]);

      const questionAudio = await this.openaiService.generateAudio(
        questionsAsks[i],
      );
      // const questionAudio = 'testA.mp3';
      let questionAudioDuration = 0;
      await new Promise<void>((resolve, reject) => {
        this.ffmpeg.ffprobe(questionAudio, (err, data) => {
          if (err) {
            reject(err);
          } else {
            questionAudioDuration = data.format.duration;
            resolve();
          }
        });
      });

      const questionExplaination = await this.openaiService.generateAudio(
        questionsAnswers[i],
      );
      // const questionExplaination = 'testB.mp3';
      let questionExplainationDuration = 0;
      await new Promise<void>((resolve, reject) => {
        this.ffmpeg.ffprobe(questionExplaination, (err, data) => {
          if (err) {
            reject(err);
          } else {
            questionExplainationDuration = data.format.duration;
            resolve();
          }
        });
      });

      const output = `generated/output${i}.mp3`;

      await new Promise<void>((resolve, reject) => {
        const ql = this.ffmpeg()
          .addInput(questionAudio)
          .addInput(questionExplaination)
          .complexFilter(
            `aevalsrc=exprs=0:d=${
              QUESTION_AUDIO_DURATION -
              (questionAudioDuration % QUESTION_AUDIO_DURATION)
            }[silenceQ],
            aevalsrc=exprs=0:d=${
              EXPLAINATION_AUDIO_DURATION -
              (questionExplainationDuration % QUESTION_AUDIO_DURATION)
            }[silenceA],
            [0:a] [silenceQ] [1:a] [silenceA] concat=n=4:v=0:a=1[outa]`,
          )
          .outputOptions([
            '-map [outa]',
            `-t ${QUESTION_AUDIO_DURATION + EXPLAINATION_AUDIO_DURATION}`,
          ])
          .saveToFile(output)
          .on('end', () => {
            resolve();
          })
          .on('error', (err) => {
            reject(err);
            throw new InternalServerErrorException('Error creating video');
          })
          .run();
      }).then(() => {
        result_audio.push(output);
      });
    }
    console.log('result_audio', result_audio);

    const output = `generated/output-game-${id}.mp3`;

    // ffmpeg join audio with each other
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = this.ffmpeg()
        .addInput('concat:' + result_audio.join('|'))
        .saveToFile(output)
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          reject(err);
          throw new InternalServerErrorException('Error creating video');
        })
        .run();
    });
    return output;
  }

  async createVideo(gameId: number) {
    return this.dIdService.generateVideo(gameId);
  }

  async waitForVideo(videoId: string) {
    await this.dIdService.isReady(videoId);

    return this.dIdService.download(videoId);
  }

  async startVideoStream(videoId: string) {
    const videoPath = `generated/output-game-${videoId}.mp4`;

    if (!fs.existsSync(videoPath)) {
      throw new NotFoundException('Video not found');
    }

    const absoluteVideoPath = `${process.cwd()}/${videoPath}`;

    return new Promise<void>((resolve, reject) => {
      const command = this.ffmpeg()
        .addInput(absoluteVideoPath)
        .addInputOptions(['-re'])
        .output('rtmp://csc13003.mooo.com/live/livestream')
        .format('flv')
        .audioCodec('aac')
        .videoCodec('libx264')
        .outputOptions(['-profile:v', 'baseline', '-level', '3.1'])
        .on('start', (commandLine) => {
          console.log('Spawned Ffmpeg with command: ' + commandLine);
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.log('Cannot process video: ' + err.message);
          reject(err);
        })
        .on('end', (stdout, stderr) => {
          console.log('Transcoding succeeded !');
        })
        .run();
    });
  }

  async stopVideoStream() {
    this.ffmpeg().kill('SIGKILL');
  }

  async fetchClips() {
    return this.dIdService.fetchClips();
  }

  async getQuizGameIdsByEventId(eventId: number) {
    const quizs = await this.prisma.quizGame.findMany({
      where: { eventId, isDeleted: false },
    });

    return quizs.map((quiz) => quiz.id);
  }
}
