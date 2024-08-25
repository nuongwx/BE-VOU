import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuestionService } from './question.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QuestionGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly questionService: QuestionService) {}

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
    @MessageBody() data: { length: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const questions = await this.questionService.generateRandomQuestions(
        data.length,
      );
      client.emit('randomQuestionsGenerated', questions);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  // Function to broadcast a new question to all clients
  async broadcastNewQuestion(questionId: number) {
    const question = await this.questionService.findOne(questionId);
    this.server.emit('newQuestion', question);
  }
}
