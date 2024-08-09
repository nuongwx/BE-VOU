import { Module } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { RedeemResolver } from './redeem.resolver';

@Module({
  providers: [RedeemResolver, RedeemService],
})
export class RedeemModule {}
