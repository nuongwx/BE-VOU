import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";

@InputType()
export class SignUpInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  role?: string;
}
