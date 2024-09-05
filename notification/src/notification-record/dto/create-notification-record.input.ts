import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNotificationRecordInput {
  @Field(() => Int, { description: 'User ID' })
  userId: number;

  @Field(() => String, { description: 'DEBUG: Expo push token', nullable: true })
  expoPushToken?: string;

  @Field(() => String, { description: 'Notification title' })
  title: string;

  @Field(() => String, { description: 'Notification body' })
  body: string;

  @Field(() => String, { description: 'Notification data', nullable: true })
  data: string;
}
