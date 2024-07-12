import { Module } from '@nestjs/common';
import { AServiceService } from './a-service.service';
import { AServiceController } from './a-service.controller';

@Module({
  controllers: [AServiceController],
  providers: [AServiceService],
})
export class AServiceModule {}
