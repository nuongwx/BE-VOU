import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { RedeemService } from './redeem.service';
import { Redeem } from './entities/redeem.entity';
import { CreateRedeemInput } from './dto/create-redeem.input';
import { UpdateRedeemInput } from './dto/update-redeem.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Redeem)
export class RedeemResolver {
  constructor(
    private readonly redeemService: RedeemService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Redeem)
  createRedeem(@Args('createRedeemInput') createRedeemInput: CreateRedeemInput) {
    return this.redeemService.create(createRedeemInput);
  }

  @Query(() => [Redeem], { name: 'redeems' })
  findAll() {
    return this.redeemService.findAll();
  }

  @Query(() => Redeem, { name: 'redeem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.redeemService.findOne(id);
  }

  @Mutation(() => Redeem)
  updateRedeem(@Args('updateRedeemInput') updateRedeemInput: UpdateRedeemInput) {
    return this.redeemService.update(updateRedeemInput.id, updateRedeemInput);
  }

  @Mutation(() => Redeem)
  removeRedeem(@Args('id', { type: () => Int }) id: number) {
    return this.redeemService.remove(id);
  }

  @Query(() => [Redeem], { name: 'redeemsByUser' })
  findByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.prisma.redeem.findMany({
      where: {
        userId,
      },
    });
  }

  @ResolveField('user', () => User, { description: 'Redeem User' })
  user(@Parent() redeem: Redeem) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id: redeem.userId,
      },
    });
  }
}
