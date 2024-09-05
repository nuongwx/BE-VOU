import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class NotificationKey {
  @Field(() => Int, { description: 'Key record Id' })
  id: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => String, { description: 'Expo Push Token' })
  expoPushToken: string;

  @Field(() => Date, { description: 'Created At' })
  createdAt: Date;

  @Field(() => Date, { description: 'Updated At' })
  updatedAt: Date;
}
