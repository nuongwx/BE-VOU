import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { QuizGameService } from './quiz.service';

@Controller()
export class QuizController {
  constructor(private readonly quizService: QuizGameService) {}

  @MessagePattern({ cmd: 'get_quiz_game_by_id' })
  async getQuizGameById(data: { id: number }) {
    return this.quizService.getQuizGameById(data.id);
  }

  @MessagePattern({ cmd: 'get_quiz_game_ids_by_event_id' })
  async getQuizGameIdsByEventId(data: { eventId: number }) {
    return this.quizService.getQuizGameIdsByEventId(data.eventId);
  }
}
