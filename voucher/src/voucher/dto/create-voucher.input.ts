import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVoucherInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  qr_code: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Int)
  value: number;

  @Field(() => Int, { nullable: true })
  userId: number;

  @Field(() => [String], { nullable: true })
  image?: [string];

  @Field(() => Date, { nullable: true })
  startTime: Date;

  @Field(() => Date, { nullable: true })
  endTime: Date;
}
