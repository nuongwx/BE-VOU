import { Injectable, Inject } from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('REPORT_SERVICE') private rabbitClient: ClientProxy) {}

  async validateToken(token: string): Promise<any> {
    const response = firstValueFrom(
      this.rabbitClient
        .send({ cmd: 'validate_token' }, { token })
        .pipe(timeout(50000)),
    );

    return response;
  }
}
