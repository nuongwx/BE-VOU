import { InputType, Field, Int } from '@nestjs/graphql';
import { UpdateAnswerInput } from '../../answer/dto/update-answer.input';

@InputType()
export class UpdateQuestionInput {
  @Field(() => Int)
  id: number;

  @Field(() => [String], { nullable: true })
  content: string;

  @Field(() => [String], { nullable: true })
  images: string[];

  @Field(() => [UpdateAnswerInput], { nullable: true })
  answers: UpdateAnswerInput[];

  @Field(() => Int, { nullable: true })
  correctAnswerId?: number;

  @Field(() => Int, { nullable: true })
  quizGameId?: number;
}
