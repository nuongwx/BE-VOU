import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAGraphInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
