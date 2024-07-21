import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class SignUpInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Field()
    password: string;
}