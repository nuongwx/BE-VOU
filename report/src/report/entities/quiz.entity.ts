import { ObjectType, Field, Int } from '@nestjs/graphql';

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

  @Field(() => Number)
  eventId: number;
}
