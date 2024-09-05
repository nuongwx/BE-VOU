import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationKeyService } from './notification-key.service';
import { NotificationKey } from './entities/notification-key.entity';
import { CreateNotificationKeyInput } from './dto/create-notification-key.input';
import { UpdateNotificationKeyInput } from './dto/update-notification-key.input';

@Resolver(() => NotificationKey)
export class NotificationKeyResolver {
  constructor(private readonly notificationKeyService: NotificationKeyService) {}

  @Mutation(() => NotificationKey)
  createNotificationKey(@Args('createNotificationKeyInput') createNotificationKeyInput: CreateNotificationKeyInput) {
    return this.notificationKeyService.create(createNotificationKeyInput);
  }

  @Query(() => [NotificationKey], { name: 'notificationKey' })
  findAll() {
    return this.notificationKeyService.findAll();
  }

  @Query(() => NotificationKey, { name: 'notificationKey' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.notificationKeyService.findOne(id);
  }

  @Mutation(() => NotificationKey)
  updateNotificationKey(@Args('updateNotificationKeyInput') updateNotificationKeyInput: UpdateNotificationKeyInput) {
    return this.notificationKeyService.update(updateNotificationKeyInput.id, updateNotificationKeyInput);
  }

  @Mutation(() => NotificationKey)
  removeNotificationKey(@Args('id', { type: () => Int }) id: number) {
    return this.notificationKeyService.remove(id);
  }
}
