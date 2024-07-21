import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePrismaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
