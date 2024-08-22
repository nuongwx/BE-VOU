import { Injectable } from '@nestjs/common';
import { ShakeService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly shakeService: ShakeService) {}

  async countTotalPlayers(): Promise<number> {
    // return this.reportService.user.count({
    //   where: { role: 'player' },
    // });

    return this.shakeService.user.count();
  }

  // async countTotalGames(): Promise<number> {
  //   const quizGameCount = await this.reportService.quizGame.count();
  //   const shakeGameCount = await this.reportService.shakeGame.count();
  //   return quizGameCount + shakeGameCount;
  // }

  // async countTotalVouchers(): Promise<number> {
  //   return this.reportService.voucher.count();
  // }

  // async countTotalBrands(): Promise<number> {
  //   return this.reportService.brand.count();
  // }

  // async countByDate(entity: string, date: Date): Promise<number> {
  //   const startOfDay = new Date(date);
  //   startOfDay.setHours(0, 0, 0, 0);

  //   const endOfDay = new Date(date);
  //   endOfDay.setHours(23, 59, 59, 999);

  //   switch (entity) {
  //     case 'player':
  //       return this.reportService.user.count({
  //         where: {
  //           role: 'player',
  //           createdAt: {
  //             gte: startOfDay,
  //             lte: endOfDay,
  //           },
  //         },
  //       });
  //     case 'game':
  //       const quizGameCount = await this.reportService.quizGame.count({
  //         where: {
  //           createdAt: {
  //             gte: startOfDay,
  //             lte: endOfDay,
  //           },
  //         },
  //       });
  //       const shakeGameCount = await this.reportService.shakeGame.count({
  //         where: {
  //           createdAt: {
  //             gte: startOfDay,
  //             lte: endOfDay,
  //           },
  //         },
  //       });
  //       return quizGameCount + shakeGameCount;
  //     case 'voucher':
  //       return this.reportService.voucher.count({
  //         where: {
  //           createdAt: {
  //             gte: startOfDay,
  //             lte: endOfDay,
  //           },
  //         },
  //       });
  //     case 'brand':
  //       return this.reportService.brand.count({
  //         where: {
  //           createdAt: {
  //             gte: startOfDay,
  //             lte: endOfDay,
  //           },
  //         },
  //       });
  //     default:
  //       throw new Error('Invalid entity type');
  //   }
  // }

  // async getHighestCount(entity: string): Promise<number> {
  //   const data = await this.reportService[entity].findMany({
  //     select: {
  //       count: true,
  //     },
  //     orderBy: {
  //       count: 'desc',
  //     },
  //     take: 1,
  //   });
  //   return data[0]?.count || 0;
  // }
}
