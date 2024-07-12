import { Module } from '@nestjs/common';
import { AGraphSpecService } from './a-graph-spec.service';
import { AGraphSpecResolver } from './a-graph-spec.resolver';

@Module({
  providers: [AGraphSpecResolver, AGraphSpecService],
})
export class AGraphSpecModule {}
