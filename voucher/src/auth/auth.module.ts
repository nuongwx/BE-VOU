import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'VOUCHER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://ngwx:1@ngwx.mooo.com:5672/default'],
          queue: 'auth_queue',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
