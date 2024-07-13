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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      playground: true,
      debug: true,
      driver: ApolloDriver,
    }),
    PrismaModule,
    GameModule,
    ItemModule,
    InventoryItemModule,
    InventoryModule,
    TransactionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
