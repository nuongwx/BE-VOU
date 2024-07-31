import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { ItemModule } from './item/item.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { InventoryModule } from './inventory/inventory.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      playground: false,
      debug: true,
      driver: ApolloDriver,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
    }),
    PrismaModule,
    GameModule,
    ItemModule,
    InventoryItemModule,
    InventoryModule,
    TransactionModule,
    UserModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
