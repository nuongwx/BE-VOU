import { Module } from '@nestjs/common';
import { AServiceModule } from './a-service/a-service.module';

@Module({
  imports: [AServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
