import { Module } from '@nestjs/common';
import { AGraphService } from './a-graph.service';
import { AGraphResolver } from './a-graph.resolver';

@Module({
  providers: [AGraphResolver, AGraphService],
})
export class AGraphModule {}
