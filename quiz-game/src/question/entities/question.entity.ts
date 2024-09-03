import { ObjectType, Field } from '@nestjs/graphql';
import { QuizGameAnswerEntity } from '../../answer/entities/answer.entity';

@ObjectType()
export class QuizGameQuestionEntity {
  @Field(() => Number)
  id: number;

  @Field(() => String, { nullable: true })
  content: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => [QuizGameAnswerEntity])
  answers: QuizGameAnswerEntity[];

  @Field(() => Number, { nullable: true })
  correctAnswerId: number;

  @Field(() => Number, { nullable: true })
  quizGameId?: number;
}
