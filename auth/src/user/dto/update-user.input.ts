import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';
import { Role, OTPMethod, Sex } from '@prisma/client';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(type => Int)
  id: number;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  facebookAccount?: string;

  @Field({ nullable: true })
  OTP?: string;

  @Field({ nullable: true })
  hashedRefreshToken?: string;

  @Field({ nullable: true })
  passwordResetToken?: string;

  @Field({ nullable: true })
  passwordResetExpires?: Date;
}
