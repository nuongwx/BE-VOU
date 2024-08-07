import { InputType, Field } from '@nestjs/graphql';
import { Role, OTPMethod, Sex } from '@prisma/client';

@InputType()
export class CreateUserInput {
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

    @Field(type => OTPMethod)
    OTP_method: OTPMethod;

    @Field()
    dateOfBirth: Date;

    @Field(type => Sex)
    sex: Sex;

    @Field()
    hashedPassword: string;
}
