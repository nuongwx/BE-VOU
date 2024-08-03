import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Request {
  @Field(() => Int, { description: 'Request Id' })
  id: number;

  @Field(() => Int, { description: 'Sender Id' })
  senderId: number;

  @Field(() => Int, { description: 'Receiver Id' })
  receiverId: number;

  @Field(() => Boolean, { description: 'Is Accepted' })
  isAccepted: boolean;
}
