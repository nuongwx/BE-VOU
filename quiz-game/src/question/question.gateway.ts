import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuestionService } from './question.service';
import {
  ArgumentMetadata,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  PipeTransform,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, map, Observable } from 'rxjs';
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
} from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { QuizGameService } from '../quiz/quiz.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocketAuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const socket = context.switchToWs().getClient();
    const username = socket.id; // TODO: Replace with actual user ID extraction logic from auth token
    if (!socket.handshake.auth.username)
      socket.handshake.auth.username = username;
    return next.handle().pipe(map((data) => ({ username, data })));
  }
}

const connectedClients = new Map<string, Socket>();
const incorrectClients: Set<string> = new Set();
const correctClients: Set<string> = new Set();

let currentQuestionId = 0;
let currentQuestionIndex = 0;
let totalQuestionsCount = 0;
let currentGameId = 0;

let checking = false;

const questionAnswerTimeout = 10000;
const timeBetweenQuestions = 10000;

@Injectable()
export class TransformInterceptor implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const result = JSON.parse(value);
      return { ...result, timestamp: Date.now() };
    } catch (error) {
      return value;
    }
  }
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseInterceptors(SocketAuthInterceptor)
export class QuestionGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly questionService: QuestionService,
    @Inject('VOUCHER_SERVICE')
    private readonly voucherServiceClient: ClientProxy,
    private schedulerRegistry: SchedulerRegistry,
    private readonly prismaService: PrismaService,
    private readonly quizGameService: QuizGameService,
    private readonly configService: ConfigService,
  ) {}

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
    connectedClients.delete(client.handshake.auth.username);
  }

  @SubscribeMessage('debug')
  handleDebug(client: Socket) {
    console.log('Debug', client.handshake.auth);
    console.log('Connected clients:', Array.from(connectedClients.keys()));
  }

  async info() {
    const interval = setInterval(() => {
      this.server.emit('broadcast', {
        totalConnections: this.server.engine.clientsCount,
      });
    }, 1000);

    this.schedulerRegistry.addInterval('broadcast', interval);
  }

  @SubscribeMessage('registerPlayer')
  async handleRegisterPlayer(client: Socket, data: { id: number }) {
    if (currentGameId === 0) {
      client.emit('registerPlayerAck', {
        message: 'No game in progress',
      });
      return;
    }

    if (currentQuestionIndex !== 0) {
      client.emit('registerPlayerAck', {
        message: 'Game is already in progress',
      });
      return;
    }

    // TODO: Replace with actual user ID extraction logic from auth token
    if (!data || data.id === undefined) {
      client.emit('registerPlayerAck', {
        message: 'Invalid user ID',
      });
      return;
    }

    client.handshake.auth.username = data.id.toString();

    const username = client.handshake.auth.username;
    connectedClients.set(username, client);
    console.log('Player registered:', username);
    client.emit('registerPlayerAck', {
      username,
      sessionId: client.id,
    });
  }

  // @Interval('findAndStartGame', 10000)
  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'findAndStartGame' })
  async findAndStartGame() {
    if (checking) return; // weird bug where the interval is called twice
    checking = true;
    if (currentGameId === 0) {
      console.log(new Date(), 'Checking for active games');
      const game = await this.prismaService.quizGame.findFirst({
        where: {
          startTime: {
            lte: new Date(),
          },
          endTime: {
            gte: new Date(),
          },
          executed: false,
        },
      });

      if (game) {
        this.handleStartGame({ quizGameId: game.id });
      }
    }
    checking = false;
  }

  @SubscribeMessage('startGame')
  async handleStartGame(@MessageBody() data: { quizGameId: number }) {
    console.log('Starting game', data);
    if (currentGameId !== 0) {
      this.server.emit('error', {
        message: 'Game already in progress',
      });
      return;
    }

    if (data.quizGameId && !isNaN(data.quizGameId)) {
      const game = await this.prismaService.quizGame.findUniqueOrThrow({
        where: { id: data.quizGameId },
      });

      if (!game) {
        this.server.emit('error', {
          message: 'Quiz game not found',
        });
        return;
      }
    } else {
      this.server.emit('error', {
        message: 'Invalid quiz game ID',
      });
      return;
    }

    const { quizGameId } = data;
    console.log('Game found, starting: ', quizGameId);

    currentGameId = quizGameId;

    try {
      const quizQuestions = await this.prismaService.quizGameQuestion.findMany({
        where: {
          isDeleted: false,
          quizGames: { some: { quizGameId: quizGameId } },
        },
        include: { answers: { where: { isDeleted: false } } },
      });

      const questions =
        await this.prismaService.quizGameQuestionToQuizGameMapping.findMany({
          where: { quizGameId: quizGameId },
          orderBy: { orderIndex: 'asc' },
          include: {
            quizGameQuestion: {
              include: {
                answers: true,
              },
            },
          },
        });

      // sort questions by orderIndex
      quizQuestions.sort((a, b) => {
        return (
          questions.findIndex((q) => q.quizGameQuestion.id === a.id) -
          questions.findIndex((q) => q.quizGameQuestion.id === b.id)
        );
      });

      if (quizQuestions.length === 0) {
        this.server.emit('error', {
          message: 'No questions found for the specified quiz game.',
        });
        return;
      }

      totalQuestionsCount = quizQuestions.length;

      console.log('Fetched questions', quizQuestions);

      this.info();

      let video = 'clp_Aj5ybUQBBZsAQxylHYumT'; // TODO: Remove hardcoded video ID

      if (this.configService.get('PRODUCTION') === 'true') {
        console.log('Creating audio');
        const audio = await this.quizGameService.createAudio(quizGameId);
        console.log('Audio created', audio);

        console.log('Creating video');
        video = await this.quizGameService.createVideo(quizGameId);

        console.log('Waiting for video to be ready');
        await this.quizGameService.waitForVideo(video);
      }
      // delay 30 seconds to allow video to be ready
      console.log('Waiting for 30 seconds');
      const delay = setTimeout(() => {
        console.log('30 seconds passed');

        console.log('Starting video stream');
        this.quizGameService.startVideoStream(video);

        this.server.emit('startGame', { gameId: quizGameId });
        console.log('Game started');

        for (let i = 0; i < quizQuestions.length; i++) {
          this.scheduleQuestionEmission(quizQuestions, i);
        }
      }, 10000);
      this.schedulerRegistry.addTimeout('delay', delay);
    } catch (error) {
      console.error('Error starting game:', error);
      this.server.emit('error', {
        message: 'An error occurred while starting the game.',
      });
    }
  }

  async scheduleQuestionEmission(quizQuestions, i) {
    const questionEmitTimeout = setTimeout(() => {
      correctClients.clear();
      incorrectClients.clear();

      this.server.emit('newQuestion', {
        question: quizQuestions[i],
        answers: quizQuestions[i].answers,
      });

      currentQuestionId = quizQuestions[i].id;
      currentQuestionIndex = i;

      this.scheduleQuestionTimeout(quizQuestions[i], i);
    }, i * (timeBetweenQuestions + questionAnswerTimeout));

    this.schedulerRegistry.addTimeout(
      `questionEmitTimeout${i}`,
      questionEmitTimeout,
    );
  }

  async scheduleQuestionTimeout(question, index) {
    const questionTimeout = setTimeout(() => {
      this.server.emit('questionTimeout', { questionId: question.id });

      const questionSummaryTimeout = setTimeout(() => {
        this.emitResult();
      }, 100);

      this.schedulerRegistry.addTimeout(
        `questionSummaryTimeout${index}`,
        questionSummaryTimeout,
      );
    }, questionAnswerTimeout);

    this.schedulerRegistry.addTimeout(
      `questionTimeout${index}`,
      questionTimeout,
    );
  }

  @SubscribeMessage('endGame')
  async handleEndGame() {
    if (currentGameId === 0) {
      this.server.emit('error', {
        message: 'No game in progress',
      });
      return;
    }

    this.server.emit('endGame', { gameId: currentGameId });
    this.schedulerRegistry.getTimeouts().forEach((timeout) => {
      console.log('Clearing timeout', timeout);
      this.schedulerRegistry.deleteTimeout(timeout);
    });

    this.schedulerRegistry.getIntervals().forEach((interval) => {
      console.log('Clearing interval', interval);
      this.schedulerRegistry.deleteInterval(interval);
    });

    // wait for 10 more seconds
    setTimeout(() => {
      this.quizGameService.stopVideoStream();
    }, 10000);

    const winnersIdentifiers = Array.from(correctClients.keys());
    // cast to number
    const winners = winnersIdentifiers.map((identifier) =>
      parseInt(identifier),
    );

    winners.forEach(async (winner) => {
      const voucher = await this.quizGameService.assignVoucherForWinnerUser(
        currentGameId,
        winner,
      );

      if (voucher) {
        this.server.emit('voucherAssigned', {
          userId: winner,
          voucher,
        });
      }
    });

    await this.prismaService.quizGame.update({
      where: { id: currentGameId },
      data: { executed: true },
    });

    connectedClients.clear();
    incorrectClients.clear();
    correctClients.clear();
    currentQuestionId = 0;
    currentQuestionIndex = 0;
    totalQuestionsCount = 0;
    currentGameId = 0;
    console.log('Game ended');
  }

  async emitResult() {
    const currentQuestion =
      await this.prismaService.quizGameQuestion.findUnique({
        where: { id: currentQuestionId },
        include: { correctAnswer: true },
      });

    const questionSummary = {
      questionId: currentQuestionId,
      correctAnswerId: currentQuestion.correctAnswerId,
      incorrectCount: incorrectClients.size,
      correctCount: correctClients.size,
      totalQuestionsCount: totalQuestionsCount,
      questionAnswerTimeout: questionAnswerTimeout,
    };

    for (const [identifier, client] of connectedClients) {
      const isCorrect = correctClients.has(identifier);
      console.log(questionSummary);
      client.emit('result', {
        correct: isCorrect,
        message:
          !isCorrect && !incorrectClients.has(identifier)
            ? 'No answer submitted'
            : '',
        questionSummary,
      });
      console.log(isCorrect ? 'Correct' : 'Incorrect', identifier);
    }

    connectedClients.forEach((client, identifier) => {
      if (!correctClients.has(identifier)) connectedClients.delete(identifier);
    });

    if (currentQuestionIndex === totalQuestionsCount - 1) {
      console.log('Game ended');
      this.handleEndGame();
    }
  }

  @SubscribeMessage('answer')
  async handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody(new TransformInterceptor())
    data: { questionId: number; answerId: number; timestamp: number },
  ) {
    const identifier = client.handshake.auth.username;
    console.log('Answer', identifier, data);

    if (!connectedClients.has(identifier)) {
      client.emit('answerAck', { message: 'You are not a registered player' });
      return;
    }

    const question = await this.prismaService.quizGameQuestion.findUnique({
      where: { id: data.questionId },
      include: { answers: true },
    });

    if (!question) {
      client.emit('answerAck', { message: 'Question not found' });
      return;
    }

    const answer = question.answers.find((a) => a.id === data.answerId);
    if (!answer) {
      client.emit('answerAck', { message: 'Answer not found' });
      return;
    }

    client.emit('answerAck', {
      questionId: data.questionId,
      answerId: data.answerId,
    });

    if (question.correctAnswerId === data.answerId) {
      correctClients.add(identifier);
    } else {
      incorrectClients.add(identifier);
    }
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody()
    data: { questionId: number; answerId: number; questionShownTime: string },
    @ConnectedSocket() client: Socket,
  ) {
    const currentTime = new Date();
    const questionShownTime = new Date(data.questionShownTime);

    if (isNaN(questionShownTime.getTime())) {
      client.emit('error', { message: 'Invalid questionShownTime format' });
      return;
    }

    const elapsedTime =
      (currentTime.getTime() - questionShownTime.getTime()) / 1000;
    if (elapsedTime > 5) {
      client.emit('answerTimeout', { message: 'Time limit exceeded' });
      return;
    }

    const isCorrect = await this.questionService.checkAnswer(data.questionId, {
      id: data.answerId,
    } as any);

    client.emit('answerResult', { correct: isCorrect });
    this.server.emit('answerSubmitted', {
      questionId: data.questionId,
      answerId: data.answerId,
      isCorrect,
      elapsedTime,
    });
  }

  @SubscribeMessage('generateRandomQuestions')
  async handleGenerateRandomQuestions(
    @MessageBody()
    data: {
      userId: number;
      quizGameId: number;
      showedQuestionIds: number[];
      userSelectedAnswerIds: number[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const lengthAtEachReq = 1;
      const successRate = 80;

      const totalQuestionsCount =
        await this.questionService.getTotalQuestionsCount(data.quizGameId);

      if (data.userSelectedAnswerIds.length === totalQuestionsCount) {
        const userSubmit = data.showedQuestionIds.map((questionId, index) => ({
          questionId,
          selectedAnswerId: data.userSelectedAnswerIds[index],
        }));

        const resultAnswers =
          await this.questionService.getCorrectAnswersForQuestions(
            data.showedQuestionIds,
          );

        const expectedSubmit = resultAnswers.map((each) => ({
          questionId: each.id,
          correctAnswerId: each.correctAnswerId,
        }));

        const userCorrectAnswersCount = userSubmit.filter((userAnswer) =>
          expectedSubmit.some(
            (correctAnswer) =>
              correctAnswer.questionId === userAnswer.questionId &&
              correctAnswer.correctAnswerId === userAnswer.selectedAnswerId,
          ),
        ).length;

        const correctPercentage =
          (userCorrectAnswersCount / totalQuestionsCount) * 100;

        if (correctPercentage >= successRate) {
          await this.assignVoucher(
            client,
            data.userId,
            data.quizGameId,
            'voucherAssigned',
          );
        }
      } else {
        const questions = await this.questionService.generateRandomQuestions(
          data.quizGameId,
          lengthAtEachReq,
          data.showedQuestionIds,
        );

        client.emit('randomQuestionsGenerated', questions);
      }
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  private async assignVoucher(
    client: Socket,
    userId: number,
    quizGameId: number,
    eventName: string,
  ) {
    try {
      const assignVoucherResponse = await lastValueFrom(
        this.voucherServiceClient.send(
          { cmd: 'assign_voucher' },
          { userId, quizGameId },
        ),
      );

      if (assignVoucherResponse.success) {
        client.emit(eventName, { message: 'Voucher assigned successfully' });
      } else {
        client.emit('error', { message: 'Failed to assign voucher' });
      }
    } catch (error) {
      client.emit('error', { message: 'Voucher assignment failed' });
    }
  }

  async broadcastNewQuestion(questionId: number) {
    const question = await this.questionService.findOne(questionId);
    this.server.emit('newQuestion', question);
  }
}
