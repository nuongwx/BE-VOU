import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationRecordService } from './notification-record.service';
import { PartialType } from '@nestjs/mapped-types';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExpoNotificationService } from 'src/expo-notification/expo-notification.service';

export class CreateNotificationDto {
  userId: number;
  title: string;
  body: string;
  data: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  id: number;
}

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationRecordService: NotificationRecordService,
    private readonly prisma: PrismaService,
    private readonly expoNotificationService: ExpoNotificationService,
  ) {}

  @MessagePattern('createNotification')
  async create(@Payload() createNotificationDto: CreateNotificationDto) {
    return this.notificationRecordService.create(createNotificationDto);
  }

  @MessagePattern('findAllNotification')
  findAll() {
    return this.notificationRecordService.findAll();
  }

  @MessagePattern('findUserNotifications')
  findUserNotifications(@Payload() userId: number) {
    return this.prisma.notificationRecord.findMany({
      where: { userId },
    });
  }

  @MessagePattern('findOneNotification')
  findOne(@Payload() id: number) {
    return this.notificationRecordService.findOne(id);
  }

  // @MessagePattern('updateNotification')
  // update(@Payload() updateNotificationDto: UpdateNotificationDto) {
  //   return this.notificationRecordService.update(updateNotificationDto.id, updateNotificationDto);
  // }

  @MessagePattern('removeNotification')
  remove(@Payload() id: number) {
    return this.notificationRecordService.remove(id);
  }
}
