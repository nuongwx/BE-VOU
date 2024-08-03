import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRequestInput {
  @Field(() => Int, { description: 'Request Sender Id' })
  senderId: number;

  @Field(() => Int, { description: 'Request Receiver Id' })
  receiverId: number;
}
