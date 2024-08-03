import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  content: string;

  @Field(() => String, { nullable: true })
  image: string;
}
