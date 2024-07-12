import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'User Id' })
  id: number;

  @Field(() => Int, { description: 'Lives', defaultValue: 3 })
  lives: number;
}
