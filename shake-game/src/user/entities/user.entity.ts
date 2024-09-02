import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ShakeUser {
  @Field(() => Int, { description: 'User Id' })
  id: number;

  @Field(() => Int, { description: 'Auth User Id' })
  authUserId: number;

  @Field(() => Int, { description: 'Lives', defaultValue: 3 })
  lives: number;
}
