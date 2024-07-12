import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { AWsService } from './a-ws.service';
import { CreateAWDto } from './dto/create-a-w.dto';
import { UpdateAWDto } from './dto/update-a-w.dto';

@WebSocketGateway()
export class AWsGateway {
  constructor(private readonly aWsService: AWsService) {}

  @SubscribeMessage('createAW')
  create(@MessageBody() createAWDto: CreateAWDto) {
    return this.aWsService.create(createAWDto);
  }

  @SubscribeMessage('findAllAWs')
  findAll() {
    return this.aWsService.findAll();
  }

  @SubscribeMessage('findOneAW')
  findOne(@MessageBody() id: number) {
    return this.aWsService.findOne(id);
  }

  @SubscribeMessage('updateAW')
  update(@MessageBody() updateAWDto: UpdateAWDto) {
    return this.aWsService.update(updateAWDto.id, updateAWDto);
  }

  @SubscribeMessage('removeAW')
  remove(@MessageBody() id: number) {
    return this.aWsService.remove(id);
  }
}
