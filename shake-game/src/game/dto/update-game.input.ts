import { CreateGameInput } from './create-game.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field(() => Int, { description: 'Game Id' })
  id: number;
}
