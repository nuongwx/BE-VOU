import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUpload, Upload } from 'graphql-upload-minimal';

@InputType()
export class CreateUploadInput {
  @Field(() => String, { nullable: true })
  folder!: string;

  @Field(() => [GraphQLUpload])
  files: Promise<[Upload]>;
}
