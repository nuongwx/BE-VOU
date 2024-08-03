import { InputType, Field, Int } from '@nestjs/graphql';
import { CreateAnswerInput } from '../../answer/dto/create-answer.input';

@InputType()
export class CreateQuestionInput {
  @Field()
  content: string;

  @Field(() => [CreateAnswerInput])
  answers: CreateAnswerInput[];

  @Field(() => Int)
  correctAnswerId: number;

  @Field(() => Int)
  quizGameId: number;
}
