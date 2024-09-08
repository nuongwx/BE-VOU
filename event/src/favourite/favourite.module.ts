import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteResolver } from './favourite.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FavouriteNotificationController } from './favourite.notification.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'notification_queue',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [FavouriteNotificationController],
  providers: [FavouriteResolver, FavouriteService],
})
export class FavouriteModule {}
