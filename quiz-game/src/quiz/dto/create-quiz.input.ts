import { InputType, Field, Int } from '@nestjs/graphql';
import { IsDateString } from 'class-validator';

@InputType()
export class CreateQuizGameInput {
  @Field()
  gameName: string;

  @Field()
  @IsDateString()
  startTime: Date;

  @Field()
  @IsDateString()
  endTime: Date;

  @Field(() => Int)
  playerQuantity: number;

  @Field(() => Int)
  companyId: number;
}
