import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { VoucherService } from './voucher.service';

@Controller()
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @MessagePattern({ cmd: 'assign_voucher_to_user' })
  async assignVoucherToUser(eventId: number, userId: number) {
    return this.voucherService.assignVoucherToUser(eventId, userId);
  }
}
