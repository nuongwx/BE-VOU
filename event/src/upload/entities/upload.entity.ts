import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FileUploadResponse {
  @Field(() => String)
  url: string;
}
