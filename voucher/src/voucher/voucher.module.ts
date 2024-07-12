import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherResolver } from './voucher.resolver';

@Module({
  providers: [VoucherResolver, VoucherService]
})
export class VoucherModule {}
