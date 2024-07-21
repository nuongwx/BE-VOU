import { ObjectType, Field, Int } from '@nestjs/graphql';
import { QuizGameQuestion } from 'src/question/entities/question.entity';

@ObjectType()
export class QuizGame {
  @Field(() => Int)
  id: number;

  @Field()
  gameName: string;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field(() => Int)
  playerQuantity: number;

  @Field(() => Int)
  companyId: number;

  // @Field(() => [QuizGameQuestion])
  // questions: QuizGameQuestion[];
}
