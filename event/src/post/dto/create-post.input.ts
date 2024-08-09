import { InputType, Field, registerEnumType, Int } from '@nestjs/graphql';
import { PostStatus } from '@prisma/client';

registerEnumType(PostStatus, {
  name: 'PostStatus',
});

@InputType()
export class CreatePostInput {
  @Field(() => Int, { description: 'Event Id' })
  eventId: number;

  @Field(() => String, { description: 'Post Title' })
  title: string;

  @Field(() => String, { description: 'Post Content' })
  content: string;

  @Field(() => String, { description: 'Post Image URL' })
  image: string;

  @Field(() => PostStatus, { description: 'Post Status', defaultValue: PostStatus.DRAFT })
  status: PostStatus;
}
