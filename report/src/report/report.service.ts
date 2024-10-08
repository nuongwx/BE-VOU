import { Injectable } from '@nestjs/common';
import {  EventService,
          QuizService,
          ShakeService,
          UserService,
          VoucherService} 
        from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly shakeService: ShakeService, 
              private readonly eventService: EventService, 
              private readonly quizService: QuizService, 
              private readonly userService: UserService,
              private readonly voucherService: VoucherService
  ) {}

  async countTotalPlayers(): Promise<number> {
    return this.userService.user.count();
  }

  async countTotalGames(): Promise<number> {
    return await this.shakeService.game.count() + await this.quizService.quizGame.count();
  }

  async countTotalVouchers(): Promise<number> {
    return this.voucherService.voucher.count();
  }

  async countTotalBrands(): Promise<number> {
    return this.userService.user.count({where: {role: 'staff'}});
  }

  async countByDate(entity: string, date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    switch (entity) {
      case 'player':
        return this.userService.user.count({
          where: {
            role: 'player',
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
      case 'game':
        const quizGameCount = await this.quizService.quizGame.count({
        });
        const shakeGameCount = await this.shakeService.game.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
        return quizGameCount + shakeGameCount;
      case 'voucher':
        return this.voucherService.voucher.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
      case 'brand':
        return this.userService.user.count({
          where: {
            role: 'staff',
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
    const data = await this[entity].findMany({
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

  async getPlayersByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return this.userService.user.findMany({
      where: {
        role: 'player',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getVouchersByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return this.voucherService.voucher.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getBrandsByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return this.userService.user.findMany({
      where: {
        role: 'staff',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getQuizGamesByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return this.quizService.quizGame.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getShakeGamesByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
   return this.shakeService.game.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return this.eventService.event.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
  
}
