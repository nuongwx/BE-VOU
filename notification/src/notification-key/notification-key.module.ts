import { Module } from '@nestjs/common';
import { NotificationKeyService } from './notification-key.service';
import { NotificationKeyResolver } from './notification-key.resolver';

@Module({
  providers: [NotificationKeyResolver, NotificationKeyService],
})
export class NotificationKeyModule {}
