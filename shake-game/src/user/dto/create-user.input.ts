import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => Int, { description: 'Game Id' })
  gameId: number;

  @Field(() => Int, { description: 'Lives', nullable: true, defaultValue: 3 })
  lives: number;
}
