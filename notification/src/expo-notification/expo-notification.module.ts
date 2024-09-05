import { Global, Module } from '@nestjs/common';
import { ExpoNotificationService } from './expo-notification.service';

@Global()
@Module({
  providers: [ExpoNotificationService],
  exports: [ExpoNotificationService],
})
export class ExpoNotificationModule {}
