import { InputType, Field, Int } from '@nestjs/graphql';
import { CreateItemInput } from 'src/item/dto/create-item.input';

@InputType()
export class CreateGameInput {
  @Field(() => String, { description: 'Game Name' })
  name: string;

  @Field(() => [Int], { description: 'Company Ids', nullable: true })
  companies: number[];

  @Field(() => [CreateItemInput], {
    description: 'Game Items set',
    nullable: true,
    defaultValue: [],
  })
  items: CreateItemInput[];

  @Field(() => Int, { description: 'Event Id', nullable: true})
  eventId: number;

  @Field(() => [Int], {
    description: 'Game Item Id',
    nullable: true,
    defaultValue: [],
  })
  itemId: number[];
}
