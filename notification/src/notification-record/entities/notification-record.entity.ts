import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class NotificationRecord {
  @Field(() => Int, { description: 'Notification ID' })
  id: number;

  @Field(() => Int, { description: 'User ID' })
  userId: number;

  @Field(() => Int, { description: 'Notification ticket ID', nullable: true })
  notificationId?: string;

  @Field(() => String, { description: 'Notification title' })
  title: string;

  @Field(() => String, { description: 'Notification body' })
  body: string;

  @Field(() => String, { description: 'Notification data', nullable: true })
  data: string;

  @Field(() => Int, { description: 'Notification status' })
  status: number;

  @Field(() => Date, { description: 'Notification creation date' })
  createdAt: Date;

  @Field(() => Date, { description: 'Notification update date' })
  updatedAt: Date;
}
