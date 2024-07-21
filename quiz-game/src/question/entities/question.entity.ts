import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class QuizGameQuestion {
  @Field(() => Int)
  id: number;

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
