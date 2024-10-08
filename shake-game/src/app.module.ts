import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { RedeemModule } from './redeem/redeem.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true,
        playground: false,
        debug: true,
        plugins: [
          ApolloServerPluginCacheControl({ defaultMaxAge: 6 }),
          responseCachePlugin(),
          ApolloServerPluginLandingPageLocalDefault(),
        ],
        cache: new KeyvAdapter(new Keyv({ store: new KeyvRedis(configService.get('REDIS_URL')) })),
        introspection: true,
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    GameModule,
    ItemModule,
    InventoryItemModule,
    InventoryModule,
    TransactionModule,
    UserModule,
    RequestModule,
    RedeemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
