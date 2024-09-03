import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { VoucherStatus } from '@prisma/client';

@ObjectType()
export class Voucher {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Int)
  value: number;

  @Field(() => Int, { nullable: true })
  eventId: number;

  @Field(() => [Int])
  brandId: [number];

  @Field(() => [String], { nullable: true })
  images?: [string];

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

  @Field(() => Int)
  userId: number;

  @Field(() => String, { nullable: true })
  qr_code: string;

  @Field(() => [String], { nullable: true })
  image?: [string];
}

@ObjectType()
export class VoucherTran {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  voucherId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String, { nullable: true })
  qr_code: string;

  @Field(() => [String], { nullable: true })
  image?: [string];
}

registerEnumType(VoucherStatus, {
  name: 'VoucherStatus',
});
