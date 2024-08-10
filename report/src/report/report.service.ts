import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async countTotalPlayers(): Promise<number> {
    return this.prisma.user.count({
      where: { role: 'player' },
    });
  }

  async countTotalGames(): Promise<number> {
    const quizGameCount = await this.prisma.quizGame.count();
    const shakeGameCount = await this.prisma.shakeGame.count();
    return quizGameCount + shakeGameCount;
  }

  async countTotalVouchers(): Promise<number> {
    return this.prisma.voucher.count();
  }

  async countTotalBrands(): Promise<number> {
    return this.prisma.brand.count();
  }

  async countByDate(entity: string, date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    switch (entity) {
      case 'player':
        return this.prisma.user.count({
          where: {
            role: 'player',
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
      case 'game':
        const quizGameCount = await this.prisma.quizGame.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
        const shakeGameCount = await this.prisma.shakeGame.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
        return quizGameCount + shakeGameCount;
      case 'voucher':
        return this.prisma.voucher.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
      case 'brand':
        return this.prisma.brand.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
      default:
        throw new Error('Invalid entity type');
    }
  }

  async getHighestCount(entity: string): Promise<number> {
    const data = await this.prisma[entity].findMany({
      select: {
        count: true,
      },
      orderBy: {
        count: 'desc',
      },
      take: 1,
    });
    return data[0]?.count || 0;
  }
}
