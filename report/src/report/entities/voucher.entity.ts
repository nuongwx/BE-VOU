import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class Voucher {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  qr_code: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Int)
  value: number;

  @Field(() => Int)
  eventId: number;

  @Field(() => [Int])
  brandId: [number];

  @Field(() => [String], { nullable: true })
  image?: [string];

  @Field(() => Date, { nullable: true })
  startTime: Date;

  @Field(() => Date, { nullable: true })
  endTime: Date;
}