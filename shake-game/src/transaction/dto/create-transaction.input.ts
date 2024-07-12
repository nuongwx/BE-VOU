import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => Int, { description: 'Inventory Item Id' })
  itemId: number;

  @Field(() => Int, { description: 'Amount', nullable: true, defaultValue: 1 })
  amount: number;

  @Field(() => Int, { description: 'Sender Id' })
  senderId: number;

  @Field(() => Int, { description: 'Receiver Id' })
  receiverId: number;
}
