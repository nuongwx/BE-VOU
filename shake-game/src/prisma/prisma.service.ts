import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaService as NewPrismaService } from './new.prisma.service';

@Injectable()
export class LegacyPrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL', 'localhost'),
        },
      },
    });
    this.$connect();
  }

  // async onModuleInit(): Promise<void> {
  //   await this.$connect();
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   this.$on('query', async (e) => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     console.log(`${e.query} ${e.params}`);
  //   });
  // }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    // -prisma.$on('beforeExit', () => { /* your code */ })
    // +process.on('beforeExit', () => { /* your code */ })

    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}

export { NewPrismaService as PrismaService };
