import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class QuizGameQuestionEntity {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  content: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => [String])
  answers: string[];

  @Field(() => Number)
  correctAnswerId: number;

  @Field(() => Number, { nullable: true })
  quizGameId?: number;
}
