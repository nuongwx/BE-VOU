import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class VerifyOtpInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  otp: string;
}
