import { Resolver, Query, Mutation, Args, Int, registerEnumType, ResolveField, Parent } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostStatus } from '@prisma/client';
import { Event } from 'src/event/entities/event.entity';

registerEnumType(PostStatus, {
  name: 'PostStatus',
});

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postService.create(createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postService.remove(id);
  }

  @Query(() => [Post], { name: 'postsByEventId' })
  async getPostsByEventId(@Args('eventId', { type: () => Int }) eventId: number) {
    return this.prisma.post.findMany({
      where: {
        eventId,
      },
    });
  }

  @Query(() => [Post], { name: 'postsByStatus' })
  async getPostsByStatus(@Args('status', { type: () => [PostStatus] }) statuses: PostStatus[]) {
    return this.prisma.post.findMany({
      where: {
        status: {
          in: statuses,
        },
      },
    });
  }

  @ResolveField('event', () => Event, { description: 'Post Event' })
  event(@Parent() post: Post) {
    return this.prisma.event.findUniqueOrThrow({
      where: {
        id: post.eventId,
      },
    });
  }
}
