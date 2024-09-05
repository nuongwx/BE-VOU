import { CreateNotificationKeyInput } from './create-notification-key.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationKeyInput extends PartialType(CreateNotificationKeyInput) {
  @Field(() => Int)
  id: number;
}
