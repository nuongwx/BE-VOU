import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notificationRecord.create({
      data: createNotificationDto,
    });
  }

  findAll() {
    return this.prisma.notificationRecord.findMany();
  }

  findOne(id: number) {
    return this.prisma.notificationRecord.findUnique({
      where: { id },
    });
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notificationRecord.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  remove(id: number) {
    return this.prisma.notificationRecord.delete({
      where: { id },
    });
  }
}
