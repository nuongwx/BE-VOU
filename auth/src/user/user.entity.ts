import {ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class UserEntity {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field(() => String, { nullable: true })
    userName: string;
}