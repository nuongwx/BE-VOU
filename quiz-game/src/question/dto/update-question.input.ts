import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  content?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => [String], { nullable: true })
  answers?: string[];

  @Field({ nullable: true })
  correct_answer?: string;

  @Field(() => Int, { nullable: true })
  quizGameId?: number;
}
