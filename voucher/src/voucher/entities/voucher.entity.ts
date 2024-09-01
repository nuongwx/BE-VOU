import { ObjectType, Field, Int } from '@nestjs/graphql';

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

@ObjectType()
export class VoucherLine {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  voucherId: number;

  @Field(() => String)
  userId: string;

  @Field(() => String, { nullable: true })
  qr_code: string;

  @Field(() => [String], { nullable: true })
  image?: [string];
}
