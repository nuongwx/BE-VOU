import { CreateAGraphInput } from './create-a-graph.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAGraphInput extends PartialType(CreateAGraphInput) {
  @Field(() => Int)
  id: number;
}
