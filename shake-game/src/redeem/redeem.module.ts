import { Module } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { RedeemResolver } from './redeem.resolver';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [GameModule],
  providers: [RedeemResolver, RedeemService],
})
export class RedeemModule {}
