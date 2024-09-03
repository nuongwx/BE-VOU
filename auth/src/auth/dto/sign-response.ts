import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';
import {IsNotEmpty, IsString} from 'class-validator';

@ObjectType()
export class SignResponse {
    @IsNotEmpty()
    @IsString()
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;

    @Field(() => UserEntity)
    user: UserEntity;
}