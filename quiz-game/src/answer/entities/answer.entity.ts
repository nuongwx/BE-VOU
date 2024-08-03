import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class QuizGameAnswerEntity {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  image: string;
}
