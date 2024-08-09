import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRedeemInput {
  @Field(() => Int, { description: 'User Id' })
  userId: number;
}
