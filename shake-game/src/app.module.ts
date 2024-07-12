import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { AWsModule } from './a-ws/a-ws.module';
import { AServiceModule } from './a-service/a-service.module';
import { AGraphModule } from './a-graph/a-graph.module';
import { ARestModule } from './a-rest/a-rest.module';
import { GameModule } from './game/game.module';
import { ItemModule } from './item/item.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { InventoryModule } from './inventory/inventory.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { AGraphSpecModule } from './a-graph-spec/a-graph-spec.module';

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
    AWsModule,
    AServiceModule,
    AGraphModule,
    ARestModule,
    GameModule,
    ItemModule,
    InventoryItemModule,
    InventoryModule,
    TransactionModule,
    UserModule,
    AGraphSpecModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
