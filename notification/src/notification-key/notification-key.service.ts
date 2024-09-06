import { Injectable } from '@nestjs/common';
import { CreateNotificationKeyInput as CreateNotificationKeyInput } from './dto/create-notification-key.input';
import { UpdateNotificationKeyInput as UpdateNotificationKeyInput } from './dto/update-notification-key.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationKeyInput: CreateNotificationKeyInput) {
    if (createNotificationKeyInput.expoPushToken === '') {
      return null;
    }

    const expoPushToken = await this.prisma.notificationKey.findMany({
      where: {
        expoPushToken: createNotificationKeyInput.expoPushToken,
        userId: { not: createNotificationKeyInput.userId },
      },
    });

    if (expoPushToken.length > 0) {
      expoPushToken.forEach(async (token) => {
        await this.prisma.notificationKey.delete({
          where: { id: token.id },
        });
      });
    }

    return this.prisma.notificationKey.upsert({
      where: { userId: createNotificationKeyInput.userId },
      update: createNotificationKeyInput,
      create: createNotificationKeyInput,
    });
  }

  findAll() {
    return this.prisma.notificationKey.findMany();
  }

  findOne(id: number) {
    return this.prisma.notificationKey.findUnique({
      where: { id },
    });
  }

  update(id: number, updateNotificationKeyInput: UpdateNotificationKeyInput) {
    return this.prisma.notificationKey.update({
      where: { id },
      data: updateNotificationKeyInput,
    });
  }

  remove(id: number) {
    return this.prisma.notificationKey.delete({
      where: { id },
    });
  }
}
