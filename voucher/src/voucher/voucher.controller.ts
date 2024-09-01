import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { VoucherService } from './voucher.service';

@Controller()
export class AuthController {
  constructor(private readonly voucherService: VoucherService) {}

  @MessagePattern({ cmd: 'assign_voucher' })
  async validateToken(voucherId: number, userId: number, qr_code: string) {
    return this.voucherService.addVoucherToUser(voucherId, userId, qr_code);
  }
}
