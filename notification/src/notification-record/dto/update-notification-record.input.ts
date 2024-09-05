import { CreateNotificationRecordInput } from './create-notification-record.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationRecordInput extends PartialType(CreateNotificationRecordInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { description: 'Notification ID' })
  notificationId: string;
}
