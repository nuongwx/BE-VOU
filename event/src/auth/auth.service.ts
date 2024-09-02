import { Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('EVENT_SERVICE') private rabbitClient: ClientProxy) {}

  async validateToken(token: string): Promise<any> {
    const response = this.rabbitClient.send({ cmd: 'validate_token' }, token);
    return lastValueFrom(response);
  }
}
