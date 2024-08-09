import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Redeem {
  @Field(() => Int, { description: 'Redeem Id' })
  id: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;
}
