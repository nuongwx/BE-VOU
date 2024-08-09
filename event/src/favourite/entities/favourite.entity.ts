import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Favourite {
  @Field(() => Int, { description: 'Favourite Id' })
  id: number;

  @Field(() => Int, { description: 'Event Id' })
  eventId: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;
}
