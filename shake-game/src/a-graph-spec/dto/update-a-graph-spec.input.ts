import { CreateAGraphSpecInput } from './create-a-graph-spec.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAGraphSpecInput extends PartialType(CreateAGraphSpecInput) {
  @Field(() => Int)
  id: number;
}
