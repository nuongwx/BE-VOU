import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, registerEnumType } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from 'src/post/entities/post.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';
import { EventStatus } from '@prisma/client';

registerEnumType(EventStatus, {
  name: 'EventStatus',
});

@Resolver(() => Event)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventService.create(createEventInput);
  }

  @Query(() => [Event], { name: 'events' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    return this.eventService.findAll(limit, offset);
  }

  @Query(() => Event, { name: 'event' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.eventService.findOne(id);
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventService.remove(id);
  }

  @ResolveField('posts', () => [Post], { description: 'Event Posts' })
  posts(@Parent() event: Event) {
    return this.prisma.post.findMany({
      where: {
        eventId: event.id,
      },
    });
  }

  @ResolveField('favourites', () => [Favourite], { description: 'Event Favourites' })
  favourites(@Parent() event: Event) {
    return this.prisma.favourite.findMany({
      where: {
        eventId: event.id,
      },
    });
  }

  @Query(() => [Event], { name: 'getAllUpcomingEvents' })
  getAllUpcomingEvents() {
    return this.eventService.getAllUpcomingEvents();
  }

  @Query(() => [Event], { name: 'getAllOngoingEvents' })
  getAllOngoingEvents() {
    return this.eventService.getAllOngoingEvents();
  }

  @Query(() => [Event], { name: 'getEventByBrandId' })
  getEventByBrandId(@Args('userId', { type: () => Int }) userId: number) {
    return this.eventService.getEventByBrandId(userId);
  }

  @Query(() => Event, { name: 'getEventWithGameIds' })
  getEventWithGameIds(@Args('eventId', { type: () => Int }) eventId: number) {
    return this.eventService.getEventWithGameIds(eventId);
  }
}
