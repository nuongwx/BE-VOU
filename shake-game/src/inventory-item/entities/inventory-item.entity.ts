import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class InventoryItem {
  @Field(() => Int, { description: 'Inventory Item Id' })
  id: number;

  @Field(() => Int, { description: 'Amount' })
  amount: number;
}
