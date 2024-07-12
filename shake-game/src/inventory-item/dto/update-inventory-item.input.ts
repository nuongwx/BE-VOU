import { CreateInventoryItemInput } from './create-inventory-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInventoryItemInput extends PartialType(CreateInventoryItemInput) {
  @Field(() => Int)
  id: number;
}
