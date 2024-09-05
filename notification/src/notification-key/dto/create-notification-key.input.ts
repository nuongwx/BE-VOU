import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNotificationKeyInput {
  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => String, { description: 'Expo Push Token' })
  expoPushToken: string;
}
