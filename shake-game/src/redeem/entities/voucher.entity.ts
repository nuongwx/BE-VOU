import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VoucherLine {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  voucherId: number;

  @Field(() => Int)
  userId: number;
}
