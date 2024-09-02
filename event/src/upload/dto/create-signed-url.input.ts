import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSignedUrlInput {
  @Field(() => String, { nullable: true, defaultValue: '' })
  folder: string;
}
