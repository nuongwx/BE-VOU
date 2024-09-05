import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationRecordService } from './notification-record.service';
import { NotificationRecord } from './entities/notification-record.entity';
import { CreateNotificationRecordInput } from './dto/create-notification-record.input';
import { UpdateNotificationRecordInput } from './dto/update-notification-record.input';

@Resolver(() => NotificationRecord)
export class NotificationRecordResolver {
  constructor(private readonly notificationRecordService: NotificationRecordService) {}

  @Mutation(() => NotificationRecord)
  createNotificationRecord(
    @Args('createNotificationRecordInput') createNotificationRecordInput: CreateNotificationRecordInput,
  ) {
    return this.notificationRecordService.create(createNotificationRecordInput);
  }

  @Query(() => [NotificationRecord], { name: 'notificationRecords' })
  findAll() {
    return this.notificationRecordService.findAll();
  }

  @Query(() => [NotificationRecord], { name: 'userNotifications' })
  findUserNotifications(@Args('userId', { type: () => Int }) userId: number) {
    return this.notificationRecordService.findUserNotifications(userId);
  }

  @Query(() => NotificationRecord, { name: 'notificationRecord' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.notificationRecordService.findOne(id);
  }

  @Mutation(() => NotificationRecord)
  updateNotificationRecord(
    @Args('updateNotificationRecordInput') updateNotificationRecordInput: UpdateNotificationRecordInput,
  ) {
    return this.notificationRecordService.update(updateNotificationRecordInput.id, updateNotificationRecordInput);
  }

  @Mutation(() => NotificationRecord)
  removeNotificationRecord(@Args('id', { type: () => Int }) id: number) {
    return this.notificationRecordService.remove(id);
  }
}
