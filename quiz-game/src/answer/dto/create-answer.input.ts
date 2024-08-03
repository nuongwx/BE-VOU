import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnswerInput {
  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  image?: string;
}
