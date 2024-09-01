import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateShakeUserInput {
  @Field(() => Int, { description: 'Game Id' })
  gameId: number;

  @Field(() => Int, { description: 'Auth User Id' })
  authUserId: number;

  @Field(() => Int, { description: 'Lives', nullable: true, defaultValue: 3 })
  lives: number;
}
