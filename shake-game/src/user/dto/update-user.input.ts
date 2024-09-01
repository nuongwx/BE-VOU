import { CreateShakeUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateShakeUserInput extends PartialType(CreateShakeUserInput) {
  @Field(() => Int)
  id: number;
}
