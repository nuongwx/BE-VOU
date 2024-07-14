import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  name: string;

  @Field()
  userName: string;

  @Field()
  phoneNumber: string;

  @Field()
  password: string;

  @Field()
  email: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  sex: string;
}

@InputType()
export class LoginInput {
  @Field()
  userName: string;

  @Field()
  password: string;
}
