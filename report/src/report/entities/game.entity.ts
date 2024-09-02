import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Game {
  @Field(() => Int, { description: 'Id' })
  id: number;

  @Field(() => String, { description: 'Game Name' })
  name: string;
}
