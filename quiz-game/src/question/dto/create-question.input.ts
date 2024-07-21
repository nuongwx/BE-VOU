import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateQuestionInput {
  @Field()
  content: string;

  @Field(() => [String])
  images: string[];

  @Field(() => [String])
  answers: string[];

  @Field()
  correct_answer: string;

  @Field(() => Int)
  quizGameId: number;
}
