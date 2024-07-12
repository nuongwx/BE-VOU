import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AGraphSpec {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
