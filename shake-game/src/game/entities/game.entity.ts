import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ShakeUser } from 'src/user/entities/user.entity';

@ObjectType()
export class Game {
  @Field(() => Int, { description: 'Id' })
  id: number;

  @Field(() => String, { description: 'Game Name' })
  name: string;

  @Field(() => Int, { description: 'Event Id' })
  eventId: number;

  // @Field(() => [Int], { description: 'Company Ids' })
  // companies: number[];

  // @Field(() => [Item], { description: 'Item Ids' })
  // items: Item[];

  // @Field(() => [User], { description: 'Users' })
  // users: User[];

  // @Field(() => Int, { description: 'Default lives' })
  // lives: number;
}
