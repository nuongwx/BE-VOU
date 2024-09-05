import { Module } from '@nestjs/common';
import { AServiceModule } from './a-service/a-service.module';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationKeyModule } from './notification-key/notification-key.module';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationRecordModule } from './notification-record/notification-record.module';
import { ExpoNotificationModule } from './expo-notification/expo-notification.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true,
        playground: false,
        introspection: true,
        debug: true,
        plugins: [
          // ApolloServerPluginCacheControl({ defaultMaxAge: 0 }),
          // responseCachePlugin(),
          ApolloServerPluginLandingPageLocalDefault(),
        ],
        // cache: new KeyvAdapter(
        //   new Keyv({
        //     store: new KeyvRedis(configService.get<string>('REDIS_URL')),
        //   }),
        // ),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    // AServiceModule,
    // NotificationModule,
    NotificationKeyModule,
    NotificationRecordModule,
    ExpoNotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
