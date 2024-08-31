import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuestionService } from './question.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QuestionGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly questionService: QuestionService,
    @Inject('VOUCHER_SERVICE')
    private readonly voucherServiceClient: ClientProxy,
  ) {}

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
