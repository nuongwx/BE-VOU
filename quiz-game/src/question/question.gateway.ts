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
import { QuizGameAnswer, QuizGameQuestion } from '@prisma/client';

@Injectable()
export class SocketAuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // get the user id from the auth handshake query
    const socket = context.switchToWs().getClient();
    const username = socket.id; // TODO: get user id from auth token
    socket.handshake.auth.username = username;
    return next.handle().pipe(map((data) => ({ username, data })));
  }
}

const connectedClients = new Map<string, Socket>(); // key: userId, value: Socket

const incorrectClients: Set<string> = new Set();
const correctClients: Set<string> = new Set();

let currentQuestionId = 0;
let currentQuestionIndex = 0;

const quizQuestions: QuizGameQuestion[] = [
  {
    id: 1,
    content: 'What is the capital of France?',
    correctAnswerId: 1,
    images: [],
    isDeleted: false,
  },
  {
    id: 2,
    content: 'What is the capital of Spain?',
    correctAnswerId: 2,
    images: [],
    isDeleted: false,
  },
  {
    id: 3,
    content: 'What is the capital of Italy?',
    correctAnswerId: 3,
    images: [],
    isDeleted: false,
  },
];
const quizGameAnswer: QuizGameAnswer[] = [
  {
    id: 1,
    content: 'Paris',
    image: '',
    isDeleted: false,
    questionId: 1,
  },
  {
    id: 2,
    content: 'Madrid',
    image: '',
    isDeleted: false,
    questionId: 2,
  },
  {
    id: 3,
    content: 'Rome',
    image: '',
    isDeleted: false,
    questionId: 3,
  },
  // filler answers
  {
    id: 4,
    content: 'London',
    image: '',
    isDeleted: false,
    questionId: 1,
  },
  {
    id: 5,
    content: 'Berlin',
    image: '',
    isDeleted: false,
    questionId: 2,
  },
  {
    id: 6,
    content: 'Lisbon',
    image: '',
    isDeleted: false,
    questionId: 3,
  },
];

const questionAnswerTimeout = 10000;

const timeBetweenQuestions = 12000;

const quizGameId = 1;

@Injectable()
export class TransformInterceptor implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const result = JSON.parse(value);
      return { ...result, timestamp: Date.now() };
    } catch (error) {}
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
  ) {}

  handleDisconnect(client: any) {
    console.log(client.handshake.auth); // ????
    console.log('Client disconnected', client.id);
    connectedClients.delete(client.handshake.auth.username);
  }

  @SubscribeMessage('debug')
  // print the username and data received from the interceptor
  handleDebug(client: Socket) {
    console.log('Debug', client.handshake.auth);

    console.log('connectedClients');
    connectedClients.forEach((value, key) => {
      console.log('key', key, 'value', value.id);
    });
  }

  // @Interval(1000)
  async info() {
    // emit to all clients total socket connections
    this.server.emit('broadcast', {
      totalConnections: this.server.engine.clientsCount,
    });
    this.server.emit('debug', {
      totalConnections: this.server.engine.clientsCount,
    });
  }

  @SubscribeMessage('registerPlayer')
  async handleRegisterPlayer(client: Socket, data: string) {
    data = client.handshake.auth.username;

    // add the player to the list of players
    connectedClients.set(data, client);

    // acknowledge the player registration
    client.emit('registerPlayerAck', {
      gameId: quizGameId,
      sessionId: connectedClients.get(data).id,
      username: data,
    });
  }

  @SubscribeMessage('startGame')
  async handleStartGame() {
    // start the game
    this.server.emit('startGame', { gameId: quizGameId });
    console.log('Game started');

    // start the question loop
    for (let i = 0; i < quizQuestions.length; i++) {
      const questionEmitTimeout = setTimeout(() => {
        correctClients.clear();
        incorrectClients.clear();
        console.log('Question', i);
        this.server.emit('newQuestion', {
          question: quizQuestions[i],
          answers: quizGameAnswer.filter(
            (answer) => answer.questionId === quizQuestions[i].id,
          ),
        });
        currentQuestionId = quizQuestions[i].id;
        currentQuestionIndex = i;
        const questionTimeout = setTimeout(() => {
          console.log('Question timeout', i);
          this.server.emit('questionTimeout', {
            questionId: quizQuestions[i].id,
          });
          const questionSumaryTimeout = setTimeout(() => {
            this.emitResult();
            console.log('Result', i);
          }, 1000);
          this.schedulerRegistry.addTimeout(
            `questionSumaryTimeout${i}`,
            questionSumaryTimeout,
          );
        }, questionAnswerTimeout);
        this.schedulerRegistry.addTimeout(
          `questionTimeout${i}`,
          questionTimeout,
        );
      }, i * timeBetweenQuestions);
      this.schedulerRegistry.addTimeout(
        `questionEmitTimeout${i}`,
        questionEmitTimeout,
      );
    }
  }

  @SubscribeMessage('endGame')
  async handleEndGame() {
    // end the game
    this.server.emit('endGame', { gameId: quizGameId });
    this.schedulerRegistry.getTimeouts().forEach((timeout) => {
      clearTimeout(timeout);
    });
  }

  async emitResult() {
    const questionSumary = {
      questionId: currentQuestionId,
      correctAnswerId: quizQuestions[currentQuestionIndex].correctAnswerId,
      incorrectCount: incorrectClients.size,
      correctCount: correctClients.size,
    };

    // emit the result to the client
    for (const [identifier, client] of connectedClients) {
      if (incorrectClients.has(identifier)) {
        this.server
          .to(client.id)
          .emit('result', { correct: false, questionSumary });
        console.log('Incorrect', identifier);
      } else if (correctClients.has(identifier)) {
        this.server
          .to(client.id)
          .emit('result', { correct: true, questionSumary });
        console.log('Correct', identifier);
      } else {
        this.server.to(client.id).emit('result', {
          correct: false,
          message: 'No answer submitted',
          questionSumary,
        });
        console.log('No answer', identifier);
      }
    }

    // filter, keep only the clients that are correct
    connectedClients.forEach((client, identifier) => {
      if (!correctClients.has(identifier)) {
        connectedClients.delete(identifier);
      }
    });

    // end the game?
    if (currentQuestionIndex === quizQuestions.length - 1) {
      console.log('Game ended');
      this.handleEndGame();
    }
  }

  @SubscribeMessage('answer')
  async handleAnswer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody(new TransformInterceptor())
    data: { questionId: number; answerId: number; timestamp: number },
  ) {
    const identifier = client.handshake.auth.username;
    console.log('Answer', identifier, data);
    // check if the user is in the list of players
    if (!connectedClients.has(identifier)) {
      client.emit('answerAck', {
        message: 'You are not a registered player',
      });
      return;
    }

    // check if the answer is correct
    const question = quizQuestions.find((q) => q.id === data.questionId);
    if (!question) {
      client.emit('answerAck', { message: 'Question not found' });
      return;
    }

    const answer = quizGameAnswer.find(
      (a) => a.id === data.answerId && a.questionId === data.questionId,
    );
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
    const questionShownTime = new Date(data.questionShownTime); // TODO: fetch from question object

    if (isNaN(questionShownTime.getTime())) {
      client.emit('error', { message: 'Invalid questionShownTime format' });
      return;
    }

    const elapsedTime =
      (currentTime.getTime() - questionShownTime.getTime()) / 1000;

    // Check if answer submission is within the 5-second window
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
      const lengthAtEachReq = 1; // 1 request will return 1 question
      const successRate = 80; // 80% correct answers required to win a voucher

      // Fetch the total number of questions for the quiz game
      const totalQuestionsCount =
        await this.questionService.getTotalQuestionsCount(data.quizGameId);

      // Check if the user has answered all questions -> check answer -> assign voucher
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
        // User has not answered all questions; generate and send new questions

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
        client.emit(eventName, {
          message: 'Voucher assigned successfully',
        });
      } else {
        client.emit('error', { message: 'Failed to assign voucher' });
      }
    } catch (error) {
      client.emit('error', { message: 'Voucher assignment failed' });
    }
  }

  // Function to broadcast a new question to all clients
  async broadcastNewQuestion(questionId: number) {
    const question = await this.questionService.findOne(questionId);
    this.server.emit('newQuestion', question);
  }
}
