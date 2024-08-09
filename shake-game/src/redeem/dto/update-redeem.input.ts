import { CreateRedeemInput } from './create-redeem.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRedeemInput extends PartialType(CreateRedeemInput) {
  @Field(() => Int)
  id: number;
}
