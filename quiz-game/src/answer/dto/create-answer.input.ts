import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnswerInput {
  @Field()
  content: string;

  @Field({ nullable: true })
  image?: string;
}
