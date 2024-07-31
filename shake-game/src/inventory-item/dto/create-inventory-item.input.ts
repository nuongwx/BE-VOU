import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateInventoryItemInput {
  @Field(() => Int, { description: 'DEVELOPMENT: I need this Item Id', nullable: true })
  itemId: number;

  @Field(() => Int, { description: 'Amount', nullable: true, defaultValue: 1 })
  amount: number;

  // @Field(() => Int, { description: 'Inventory Id', nullable: true })
  // inventoryId: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;
}
