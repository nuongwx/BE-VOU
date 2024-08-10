import { Resolver, Query, Args } from '@nestjs/graphql';
import { ReportService } from './report.service';

@Resolver()
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

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
}
