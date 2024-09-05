import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class ExpoNotificationService {
  private readonly expo: Expo;
  constructor(private readonly configService: ConfigService) {
    this.expo = new Expo({ accessToken: this.configService.get<string>('EXPO_ACCESS_TOKEN') });
  }

  async sendPushNotification(to: string, title: string, body: string, data: Record<string, any>) {
    const message: ExpoPushMessage = {
      to,
      title,
      body,
      data,
    };

    const chunks = this.expo.chunkPushNotifications([message]);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
    return tickets;
  }
}
