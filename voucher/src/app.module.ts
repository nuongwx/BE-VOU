import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { VoucherModule } from './voucher/voucher.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    PrismaModule,
    VoucherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
