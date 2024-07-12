import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Item name' })
  name: string;

  @Field(() => String, {
    description: 'Item description',
    nullable: true,
    defaultValue: '',
  })
  description: string;

  @Field(() => String, {
    description: 'Item image',
    nullable: true,
    defaultValue: '',
  })
  image: string;
}
