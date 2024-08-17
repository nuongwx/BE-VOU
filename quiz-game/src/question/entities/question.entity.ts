import { ObjectType, Field } from '@nestjs/graphql';
import { QuizGameAnswerEntity } from 'src/answer/entities/answer.entity';

@ObjectType()
export class QuizGameQuestionEntity {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  content: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => [QuizGameAnswerEntity])
  answers: QuizGameAnswerEntity[];

  @Field(() => Number)
  correctAnswerId: number;

  @Field(() => Number, { nullable: true })
  quizGameId?: number;
}
