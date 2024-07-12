import { Module } from '@nestjs/common';
import { ARestService } from './a-rest.service';
import { ARestController } from './a-rest.controller';

@Module({
  controllers: [ARestController],
  providers: [ARestService],
})
export class ARestModule {}
