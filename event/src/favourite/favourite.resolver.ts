import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { FavouriteService } from './favourite.service';
import { Favourite } from './entities/favourite.entity';
import { CreateFavouriteInput } from './dto/create-favourite.input';
import { UpdateFavouriteInput } from './dto/update-favourite.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from 'src/event/entities/event.entity';

@Resolver(() => Favourite)
export class FavouriteResolver {
  constructor(
    private readonly favouriteService: FavouriteService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Favourite)
  createFavourite(@Args('createFavouriteInput') createFavouriteInput: CreateFavouriteInput) {
    return this.favouriteService.create(createFavouriteInput);
  }

  @Query(() => [Favourite], { name: 'favourites' })
  findAll() {
    return this.favouriteService.findAll();
  }

  @Query(() => Favourite, { name: 'favourite' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.favouriteService.findOne(id);
  }

  @Mutation(() => Favourite)
  updateFavourite(@Args('updateFavouriteInput') updateFavouriteInput: UpdateFavouriteInput) {
    return this.favouriteService.update(updateFavouriteInput.id, updateFavouriteInput);
  }

  @Mutation(() => Favourite)
  removeFavourite(@Args('id', { type: () => Int }) id: number) {
    return this.favouriteService.remove(id);
  }

  @Query(() => [Favourite], { name: 'favouritesByUserId' })
  async getFavouritesByUserId(@Args('userId', { type: () => Int }) userId: number) {
    return this.prisma.favourite.findMany({
      where: {
        userId,
      },
    });
  }

  @Query(() => [Favourite], { name: 'favouritesByEventId' })
  async getFavouritesByEventId(@Args('eventId', { type: () => Int }) eventId: number) {
    return this.prisma.favourite.findMany({
      where: {
        eventId,
      },
    });
  }

  @Query(() => [Favourite], { name: 'favouritesByUserIdAndEventId' })
  async getFavouritesByUserIdAndEventId(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('eventId', { type: () => Int }) eventId: number,
  ) {
    return this.prisma.favourite.findMany({
      where: {
        userId,
        eventId,
      },
    });
  }

  // @ResolveField('user', () => User, { description: 'Favourite User' })
  // user(@Parent() favourite: Favourite) {
  //   return this.prisma.user.findUnique({
  //     where: {
  //       id: favourite.userId,
  //     },
  //   });
  // }

  @ResolveField('event', () => Event, { description: 'Favourite Event' })
  event(@Parent() favourite: Favourite) {
    return this.prisma.event.findUnique({
      where: {
        id: favourite.eventId,
      },
    });
  }
}
