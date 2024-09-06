import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GameService } from './game.service';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @MessagePattern({ cmd: 'get_shake_game_by_id' })
  async getShakeGameById(data: { id: number }) {
    return this.gameService.getShakeGameById(data.id);
  }

  @MessagePattern({ cmd: 'get_shake_game_ids_by_event_id' })
  async getShakeGameIdsByEventId(data: { eventId: number }) {
    return this.gameService.getShakeGameIdsByEventId(data.eventId);
  }
}
