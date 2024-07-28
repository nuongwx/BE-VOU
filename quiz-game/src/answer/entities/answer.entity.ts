import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class QuizGameAnswer {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field({ nullable: true })
  image?: string;
}
