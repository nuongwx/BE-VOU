import { Global, INestApplication, Injectable, Logger, Module } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

function extendPrismaClient() {
  const logger = new Logger('Prisma');
  const prisma = new PrismaClient();
  return prisma.$extends({
    client: {
      async onModuleInit() {
        // Uncomment this to establish a connection on startup, this is generally not necessary
        // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management#connect
        // await Prisma.getExtensionContext(this).$connect();
      },
      async enableShutdownHooks(app: INestApplication) {
        process.on('beforeExit', async () => {
          await app.close();
        });
      },
    },
    model: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          const time = end - start;
          logger.debug(`${model}.${operation} took ${time}ms`);
          return result;
        },
        async delete<M, A>(this: M, where: Prisma.Args<M, 'delete'>): Promise<Prisma.Result<M, A, 'update'>> {
          const context = Prisma.getExtensionContext(this);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- There is no way to type a Prisma model
          return (context as any).update({
            ...where,
            data: {
              isDeleted: true,
            },
          });
        },
        async deleteMany<M, A>(
          this: M,
          where: Prisma.Args<M, 'deleteMany'>,
        ): Promise<Prisma.Result<M, A, 'updateMany'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).updateMany({
            ...where,
            data: {
              isDeleted: true,
            },
          });
        },
      },
    },
    query: {
      inventoryItem: {
        // used in inventory.resolver.ts
        async findMany({ args, query }) {
          args.where = { ...args.where, isDeleted: false };
          return query(args);
        },
      },
    },
  });
}

// https://github.com/prisma/prisma/issues/18628
const ExtendedPrismaClient = class {
  constructor() {
    return extendPrismaClient();
  }
} as new () => ReturnType<typeof extendPrismaClient>;

@Injectable()
export class PrismaService extends ExtendedPrismaClient {}

@Global()
@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
