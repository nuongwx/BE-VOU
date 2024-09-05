import { Injectable } from '@nestjs/common';
import { CreateNotificationRecordInput } from './dto/create-notification-record.input';
import { UpdateNotificationRecordInput } from './dto/update-notification-record.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExpoNotificationService } from 'src/expo-notification/expo-notification.service';

@Injectable()
export class NotificationRecordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly expoNotificationService: ExpoNotificationService,
  ) {}

  async create(createNotificationRecordInput: CreateNotificationRecordInput) {
    const user = await this.prisma.notificationKey.findUnique({
      where: { userId: createNotificationRecordInput.userId },
    });

    let key = user?.expoPushToken;

    if (!key && createNotificationRecordInput.expoPushToken) {
      key = createNotificationRecordInput.expoPushToken;
    }

    delete createNotificationRecordInput.expoPushToken;

    if (key) {
      this.expoNotificationService.sendPushNotification(
        key,
        createNotificationRecordInput.title,
        createNotificationRecordInput.body,
        {
          data: createNotificationRecordInput.data,
        },
      );
    }

    return this.prisma.notificationRecord.create({
      data: createNotificationRecordInput,
    });
  }

  findAll() {
    return this.prisma.notificationRecord.findMany();
  }

  findUserNotifications(userId: number) {
    return this.prisma.notificationRecord.findMany({
      where: { userId },
    });
  }

  findOne(id: number) {
    return this.prisma.notificationRecord.findUnique({
      where: { id },
    });
  }

  update(id: number, updateNotificationRecordInput: UpdateNotificationRecordInput) {
    return this.prisma.notificationRecord.update({
      where: { id },
      data: updateNotificationRecordInput,
    });
  }

  remove(id: number) {
    return this.prisma.notificationRecord.delete({
      where: { id },
    });
  }
}
