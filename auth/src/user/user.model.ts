import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Role {
  admin = 'admin',
  staff = 'staff',
  player = 'player',
}

registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => String)
  userName: string;

  @Field()
  phoneNumber: string;

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

  @Field()
  OTP_method: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  sex: string;
}
