import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field(() => Int, { description: 'Item Id' })
  id: number;

  @Field(() => String, { description: 'Item Name' })
  name: string;

  @Field(() => String, { description: 'Item Description' })
  description: string;

  @Field(() => String, { description: 'Item Image' })
  image: string;
}
