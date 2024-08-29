import { Resolver, Query, Args, ObjectType, Field } from '@nestjs/graphql';
import { UploadService } from './upload.service';

// @ArgsType()
// export class UploadInputArgs {
//   @Field(() => UploadParamInput, { nullable: false })
//   setting!: UploadParamInput;

//   @Field(() => GraphQLUpload)
//   file!: Promise<Upload>;
// }

// @ArgsType()
// export class UploadMultipleInputArgs {
//   @Field(() => UploadParamInput, { nullable: false })
//   setting!: UploadParamInput;

//   @Field(() => [GraphQLUpload])
//   files!: Promise<[Upload]>;
// }

import { Directive } from '@nestjs/graphql';
import { CreateSignedUrlInput } from './dto/create-signed-url.input';
import { FileUploadResponse } from './entities/upload.entity';

interface CacheControlOptions {
  maxAge?: number;
  scope?: 'PRIVATE' | 'PUBLIC';
  inheritMaxAge?: boolean;
}

export const CacheControl = ({ maxAge, scope = 'PUBLIC', inheritMaxAge }: CacheControlOptions) =>
  Directive(
    `@cacheControl(scope: ${scope}${maxAge !== undefined ? `, maxAge: ${maxAge}` : ''}${
      inheritMaxAge ? `, inheritMaxAge: ${inheritMaxAge}` : ''
    })`,
  );

@ObjectType()
export class ResponseSignedUrl {
  @Field(() => String)
  timestamp!: string;

  @Field(() => String)
  signature!: string;

  @Field(() => String)
  url!: string;
}

@Resolver(() => FileUploadResponse)
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Query(() => FileUploadResponse)
  @CacheControl({ maxAge: 0 })
  async signedUrlForUpload(
    @Args('createSignedUrlInput', { nullable: true }) createSignedUrlInput: CreateSignedUrlInput,
  ): Promise<any> {
    return this.uploadService.signedUrlForUpload(createSignedUrlInput);
  }
}
