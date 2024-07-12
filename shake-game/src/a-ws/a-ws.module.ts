import { Module } from '@nestjs/common';
import { AWsService } from './a-ws.service';
import { AWsGateway } from './a-ws.gateway';

@Module({
  providers: [AWsGateway, AWsService],
})
export class AWsModule {}
