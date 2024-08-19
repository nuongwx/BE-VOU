import { CreateVoucherInput } from './create-voucher.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVoucherInput extends PartialType(CreateVoucherInput) {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  qr_code: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Int, { nullable: true })
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
