import { Global, Module } from '@nestjs/common';
import { DiDService } from './d-id.service';

@Global()
@Module({
  providers: [DiDService],
  exports: [DiDService],
})
export class dIdModule {}
