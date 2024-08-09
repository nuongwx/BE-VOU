import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { PostStatus } from '@prisma/client';

registerEnumType(PostStatus, {
  name: 'PostStatus',
});

@ObjectType()
export class Post {
  @Field(() => Int, { description: 'Post Id' })
  id: number;

  @Field(() => Int, { description: 'Event Id' })
  eventId: number;

  @Field(() => String, { description: 'Post Title' })
  title: string;

  @Field(() => String, { description: 'Post Content' })
  content: string;

  @Field(() => String, { description: 'Post Image' })
  image: string;

  @Field(() => PostStatus, { description: 'Post Status' })
  status: PostStatus;

  @Field(() => Date, { description: 'Post Created Date' })
  createdAt: Date;

  @Field(() => Date, { description: 'Post Updated Date' })
  updatedAt: Date;
}
