import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VoucherService } from './voucher.service';
import { Voucher, VoucherLine } from './entities/voucher.entity';
import { CreateVoucherInput } from './dto/create-voucher.input';
import { UpdateVoucherInput } from './dto/update-voucher.input';
import { VoucherStatus } from '@prisma/client';

@Resolver(() => Voucher)
export class VoucherResolver {
  constructor(private readonly voucherService: VoucherService) {}

  @Mutation(() => Voucher)
  createVoucher(
    @Args('createVoucherInput') createVoucherInput: CreateVoucherInput,
  ) {
    return this.voucherService.create(createVoucherInput);
  }

  @Mutation(() => Voucher)
  addVoucherToUser(
    @Args('voucherId', { type: () => Int }) voucherId: number,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('qr_code') qr_code: string,
  ) {
    return this.voucherService.addVoucherToUser(voucherId, userId, qr_code);
  }

  @Query(() => [Voucher], { name: 'findAllVoucher' })
  findAll() {
    return this.voucherService.findAll();
  }

  @Query(() => Voucher, { name: 'findVoucher' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.voucherService.findOne(id);
  }

  @Mutation(() => Voucher, { name: 'updateVoucher' })
  updateVoucher(
    @Args('updateVoucherInput') updateVoucherInput: UpdateVoucherInput,
  ) {
    return this.voucherService.update(
      updateVoucherInput.id,
      updateVoucherInput,
    );
  }

  @Mutation(() => Voucher)
  removeVoucher(@Args('id', { type: () => Int }) id: number) {
    return this.voucherService.removeVoucher(id);
  }

  @Mutation(() => Voucher)
  removeVoucherFromUser(
    @Args('voucherId') voucherId: number,
    @Args('userId') userId: number,
  ) {
    return this.voucherService.removeVoucherFromUser(voucherId, userId);
  }

  @Query(() => [Voucher])
  findAllVoucherExpired() {
    return this.voucherService.findAllVoucherExpired();
  }

  @Query(() => [VoucherLine])
  findVoucherByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.voucherService.findVoucherByUser(userId);
  }

  @Query(() => [VoucherLine])
  findVoucherUsedByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.voucherService.findVoucherUsedByUser(userId);
  }

  @Query(() => [VoucherLine])
  findVoucherExpiredByUser(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.voucherService.findVoucherExpiredByUser(userId);
  }

  @Query(() => [VoucherLine])
  findVoucherNotUsedByUser(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.voucherService.findVoucherNotUsedByUser(userId);
  }

  @Query(() => Voucher)
  useVoucher(
    @Args('voucherId', { type: () => Int }) voucherId: number,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('qr_code') qr_code: string,
  ) {
    return this.voucherService.useVoucher(voucherId, userId, qr_code);
  }

  @Mutation(() => Voucher)
  giftVoucher(
    @Args('voucherId', { type: () => Int }) voucherId: number,
    @Args('from_user', { type: () => Int }) from_user: number,
    @Args('to_user', { type: () => Int }) to_user: number,
  ) {
    return this.voucherService.giftVoucher(voucherId, from_user, to_user);
  }

  @Query(() => Voucher, { name: 'getVoucherFromQuiz' })
  async getVoucherFromQuiz(
    @Args('quizGameId', { type: () => Int }) quizGameId: number,
  ) {
    return this.voucherService.getVoucherFromQuiz(quizGameId);
  }

  @Query(() => Voucher, { name: 'getVoucherFromShake' })
  async getVoucherFromShake(
    @Args('shakeGameId', { type: () => Int }) shakeGameId: number,
  ) {
    return this.voucherService.getVoucherFromShake(shakeGameId);
  }
}
