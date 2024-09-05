import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateQuizGameInput } from './create-quiz.input';

@InputType()
export class UpdateQuizGameInput extends PartialType(CreateQuizGameInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  gameName?: string;

  @Field({ nullable: true })
  startTime?: Date;

  @Field({ nullable: true })
  endTime?: Date;

  @Field(() => Int, { nullable: true })
  eventId: number;

  @Field(() => Int, { nullable: true })
  playerQuantity?: number;

  @Field(() => Int, { nullable: true })
  companyId?: number;
}
