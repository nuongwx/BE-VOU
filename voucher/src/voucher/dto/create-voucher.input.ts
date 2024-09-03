import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVoucherInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Int)
  value: number;

  @Field(() => [Int], { nullable: true })
  brandId: [number];

  @Field(() => [String], { nullable: true })
  images?: [string];

  @Field(() => Int, { nullable: true })
  eventId: number;

  @Field(() => Date, { nullable: true })
  startTime: Date;

  @Field(() => Date, { nullable: true })
  endTime: Date;
}
