import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVoucherInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  qr_code: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  value: number;

  @Field(() => Int)
  userId: number;

  @Field(() => [String], { nullable: true })
  image?: [string];

  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;
}
