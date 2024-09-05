import { Injectable } from '@nestjs/common';
import { CreateNotificationKeyInput as CreateNotificationKeyInput } from './dto/create-notification-key.input';
import { UpdateNotificationKeyInput as UpdateNotificationKeyInput } from './dto/update-notification-key.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationKeyService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNotificationKeyInput: CreateNotificationKeyInput) {
    const user = this.prisma.notificationKey.findUnique({
      where: { userId: createNotificationKeyInput.userId },
    });

    if (user) {
      // update
      return this.prisma.notificationKey.update({
        where: { userId: createNotificationKeyInput.userId },
        data: createNotificationKeyInput,
      });
    }

    return this.prisma.notificationKey.create({
      data: createNotificationKeyInput,
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
