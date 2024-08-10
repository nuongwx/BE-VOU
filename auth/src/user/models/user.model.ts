import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Role, OTPMethod, Sex } from '@prisma/client';
registerEnumType(Role, { name: 'Role' });
registerEnumType(OTPMethod, { name: 'OTPMethod' });
registerEnumType(Sex, { name: 'Sex'});

@ObjectType()
export class User {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  userName: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(type => Role)
  role: Role;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  facebookAccount?: string;

  @Field({ nullable: true })
  OTP?: string;

  @Field(type => OTPMethod)
  OTP_method: OTPMethod;

  @Field()
  dateOfBirth: Date;

  @Field(type => Sex)
  sex: Sex;

  @Field({ nullable: true })
  hashedRefreshToken?: string;

  @Field({ nullable: true })
  passwordResetToken?: string;

  @Field({ nullable: true })
  passwordResetExpires?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
