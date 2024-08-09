import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFavouriteInput {
  @Field(() => Int, { description: 'Event Id' })
  eventId: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;
}
