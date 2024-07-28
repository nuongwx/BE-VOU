import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsDateString } from 'class-validator';
import { CreateQuizGameInput } from './create-quiz.input';

@InputType()
export class UpdateQuizGameInput extends PartialType(CreateQuizGameInput) {
  @Field(() => Int)
  id: number;
}
