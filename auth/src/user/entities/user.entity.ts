import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Role, OTPMethod, Sex } from '@prisma/client';

// Register enums for GraphQL
registerEnumType(Role, { name: 'Role' });
registerEnumType(OTPMethod, { name: 'OTPMethod' });
registerEnumType(Sex, { name: 'Sex' });

@ObjectType()
export class UserEntity {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  userName?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  hashedPassword?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => Role)
  role: Role;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  facebookAccount?: string;

  @Field({ nullable: true })
  OTP?: string;

  @Field(() => OTPMethod, { nullable: true })
  OTP_method?: OTPMethod;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field(() => Sex, { nullable: true })
  sex?: Sex;

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

  @Field({ nullable: true })
  firebaseUID?: string;
}
