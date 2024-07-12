import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateInventoryItemInput } from 'src/inventory-item/dto/create-inventory-item.input';

@InputType()
export class CreateInventoryInput {
  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => [CreateInventoryItemInput], { description: 'Inventory Items set', nullable: true, defaultValue: [] })
  items: CreateInventoryItemInput[];
}
