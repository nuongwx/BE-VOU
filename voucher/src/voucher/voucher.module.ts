import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VoucherService } from './voucher.service';
import { VoucherResolver } from './voucher.resolver';
import { VoucherController } from './voucher.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'VOUCHER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'voucher_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [VoucherController],
  providers: [VoucherResolver, VoucherService],
})
export class VoucherModule {}
