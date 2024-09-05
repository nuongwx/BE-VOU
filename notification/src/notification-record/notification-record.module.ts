import { Module } from '@nestjs/common';
import { NotificationRecordService } from './notification-record.service';
import { NotificationRecordResolver } from './notification-record.resolver';
import { ExpoNotificationModule } from 'src/expo-notification/expo-notification.module';

@Module({
  imports: [ExpoNotificationModule],
  controllers: [],
  providers: [NotificationRecordResolver, NotificationRecordService],
})
export class NotificationRecordModule {}
