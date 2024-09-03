import { Resolver, Query, Args } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { UserEntity } from 'src/report/entities/user.entity';
import { QuizGameEntity } from 'src/report/entities/quiz.entity';
import { Game } from 'src/report/entities/game.entity';
import { Voucher } from 'src/report/entities/voucher.entity';
import { Event } from 'src/report/entities/event.entity';

@Resolver()
export class ReportResolver {
  constructor(private readonly reportService: ReportService) { }

  @Query(() => Number)
  async countTotalPlayers(): Promise<number> {
    return this.reportService.countTotalPlayers();
  }

  @Query(() => Number)
  async countTotalGames(): Promise<number> {
    return this.reportService.countTotalGames();
  }

  @Query(() => Number)
  async countTotalVouchers(): Promise<number> {
    return this.reportService.countTotalVouchers();
  }

  @Query(() => Number)
  async countTotalBrands(): Promise<number> {
    return this.reportService.countTotalBrands();
  }

  @Query(() => Number)
  async countByDate(
    @Args('entity') entity: string,
    @Args('date') date: string,
  ): Promise<number> {
    const parsedDate = new Date(date);
    return this.reportService.countByDate(entity, parsedDate);
  }

  @Query(() => Number)
  async getHighestCount(@Args('entity') entity: string): Promise<number> {
    return this.reportService.getHighestCount(entity);
  }

  @Query(() => [UserEntity])
  async getPlayersByDateRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.reportService.getPlayersByDateRange(start, end);
  }

  @Query(() => [UserEntity])
  async getBrandsByDateRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.reportService.getBrandsByDateRange(start, end);
  }

  @Query(() => [QuizGameEntity])
  async getQuizGamesByDateRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.reportService.getQuizGamesByDateRange(start, end);
  }

  @Query(() => [Game])
  async getShakeGamesByDateRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.reportService.getShakeGamesByDateRange(start, end);
  }

  @Query(() => [Voucher])
  async getVouchersByDateRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.reportService.getVouchersByDateRange(start, end);
  }

  @Query(() => [Event])
  async getEventsByDateRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.reportService.getEventsByDateRange(start, end);
  }
}
