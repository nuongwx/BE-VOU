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
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocketAuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const socket = context.switchToWs().getClient();
    const username = socket.id; // TODO: Replace with actual user ID extraction logic from auth token
    socket.handshake.auth.username = username;
    return next.handle().pipe(map((data) => ({ username, data })));
  }
}

const connectedClients = new Map<string, Socket>();
const incorrectClients: Set<string> = new Set();
const correctClients: Set<string> = new Set();

let currentQuestionId = 0;
let currentQuestionIndex = 0;

const questionAnswerTimeout = 10000;
const timeBetweenQuestions = 12000;

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
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly prismaService: PrismaService,
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
    this.server.emit('broadcast', {
      totalConnections: this.server.engine.clientsCount,
    });
  }

  @SubscribeMessage('registerPlayer')
  async handleRegisterPlayer(client: Socket, data: string) {
    const username = client.handshake.auth.username;
    connectedClients.set(username, client);
    client.emit('registerPlayerAck', {
      username,
      sessionId: client.id,
    });
  }

  @SubscribeMessage('startGame')
  async handleStartGame(@MessageBody() data: { quizGameId: number }) {
    const { quizGameId } = data;

    try {
      const quizQuestions = await this.prismaService.quizGameQuestion.findMany({
        where: {
          isDeleted: false,
          quizGames: {
            some: { quizGameId },
          },
        },
        include: { answers: { where: { isDeleted: false } } },
      });

      if (quizQuestions.length === 0) {
        this.server.emit('error', {
          message: 'No questions found for the specified quiz game.',
        });
        return;
      }

      this.server.emit('startGame', { gameId: quizGameId });
      console.log('Game started');

      for (let i = 0; i < quizQuestions.length; i++) {
        this.scheduleQuestionEmission(quizQuestions, i);
      }
    } catch (error) {
      console.error('Error starting game:', error);
      this.server.emit('error', {
        message: 'An error occurred while starting the game.',
      });
    }
  }

  scheduleQuestionEmission(quizQuestions, i) {
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
    }, i * timeBetweenQuestions);

    this.schedulerRegistry.addTimeout(
      `questionEmitTimeout${i}`,
      questionEmitTimeout,
    );
  }

  scheduleQuestionTimeout(question, index) {
    const questionTimeout = setTimeout(() => {
      this.server.emit('questionTimeout', { questionId: question.id });

      const questionSummaryTimeout = setTimeout(() => {
        this.emitResult();
      }, 1000);

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
    this.server.emit('endGame', { gameId: currentQuestionIndex });
    this.schedulerRegistry.getTimeouts().forEach((timeout) => {
      clearTimeout(timeout);
    });
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
    };

    for (const [identifier, client] of connectedClients) {
      const isCorrect = correctClients.has(identifier);
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

    if (currentQuestionIndex === connectedClients.size - 1) {
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
