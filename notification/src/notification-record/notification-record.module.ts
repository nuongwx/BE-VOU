import { Module } from '@nestjs/common';
import { NotificationRecordService } from './notification-record.service';
import { NotificationRecordResolver } from './notification-record.resolver';
import { ExpoNotificationModule } from 'src/expo-notification/expo-notification.module';
import { NotificationController } from './notification-record.controller';

@Module({
  imports: [ExpoNotificationModule],
  controllers: [NotificationController],
  providers: [NotificationRecordResolver, NotificationRecordService],
})
export class NotificationRecordModule {}
