import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Inventory {
  @Field(() => Int, { description: 'Inventory Id' })
  id: number;
}
