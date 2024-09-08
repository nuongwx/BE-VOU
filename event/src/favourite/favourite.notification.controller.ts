import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class FavouriteNotificationController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  @MessagePattern('notify_favourites')
  async notifyFavourites(data: { eventId: number; message: string }) {
    const favourites = await this.prisma.favourite.findMany({
      where: {
        event: {
          id: data.eventId,
        },
      },
    });

    const userIds = favourites.map((favourite) => favourite.userId);

    userIds.forEach((userId) => {
      this.notificationClient.emit('createNotification', {
        userId: userId,
        title: 'Event Update',
        body: data.message,
        data: JSON.stringify({ eventId: data.eventId }),
      });
    });
  }
}
