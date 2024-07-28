import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  image?: string;
}
