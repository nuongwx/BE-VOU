import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class ProducerService {
  constructor(@Inject('QUIZ_SERVICE') private rabbitClient: ClientProxy) {}

  // Send message without expecting the response
  emitToQueue<T>(title: string, object: T) {
    return this.rabbitClient.emit(title, object);
  }

  // Send message with expecting the response
  sendToQueue<T>(title: string, object: T) {
    return this.rabbitClient.send({ cmd: title }, object).pipe(timeout(5000));
  }
}
