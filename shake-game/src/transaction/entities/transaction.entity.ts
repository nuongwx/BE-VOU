import { ObjectType, Field, Int } from '@nestjs/graphql';
import { InventoryItem } from 'src/inventory-item/entities/inventory-item.entity';

@ObjectType()
export class Transaction {
  @Field(() => Int, { description: 'Transaction Id' })
  id: number;

  @Field(() => InventoryItem, { description: 'Inventory Item' })
  inventoryItem: InventoryItem;

  @Field(() => Int, { description: 'Quantity' })
  quantity: number;

  @Field(() => Int, { description: 'Sender Id' })
  senderId: number;

  @Field(() => Int, { description: 'Receiver Id' })
  receiverId: number;

  // @Field(() => User, { description: 'Sender' })
  // sender: User;

  // @Field(() => User, { description: 'Receiver' })
  // receiver: User;
}
