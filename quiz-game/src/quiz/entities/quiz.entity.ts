import { ObjectType, Field } from '@nestjs/graphql';
import { QuizGameQuestionEntity } from '../../question/entities/question.entity';

@ObjectType()
export class QuizGameEntity {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  gameName: string;

  @Field(() => String)
  startTime: Date;

  @Field(() => String)
  endTime: Date;

  @Field(() => Number)
  playerQuantity: number;

  @Field(() => Number)
  companyId: number;

  @Field(() => Number, { nullable: true })
  eventId: number;

  @Field(() => [QuizGameQuestionEntity], { nullable: true })
  questions: QuizGameQuestionEntity[];
}
